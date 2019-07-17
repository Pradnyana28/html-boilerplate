<?php
// Don't load directly
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

class SB_Instagram_Post
{
	private $instagram_post_id;

	private $instagram_api_data;

	private $db_id;

	private $media_id;

	private $top_time_stamp;

	private $resized_image_array;

	public function __construct( $instagram_post_id ) {
		global $wpdb;
		$table_name = $wpdb->prefix . SBI_INSTAGRAM_POSTS_TYPE;

		$feed_id_match = $wpdb->get_results( $wpdb->prepare( "SELECT id, media_id, top_time_stamp FROM $table_name WHERE instagram_id = %s LIMIT 1", $instagram_post_id ), ARRAY_A );

		$this->db_id = ! empty( $feed_id_match ) ? $feed_id_match[0]['id'] : '';
		$this->media_id = ! empty( $feed_id_match ) ? $feed_id_match[0]['media_id'] : '';
		$this->top_time_stamp = ! empty( $feed_id_match ) && isset( $feed_id_match[0]['top_time_stamp'] ) ? $feed_id_match[0]['top_time_stamp'] : '';

		$this->instagram_post_id = $instagram_post_id;
	}

	public function exists_in_posts_table() {
		return ! empty( $this->db_id );
	}

	public function set_instagram_api_data( $instagram_api_data ) {
		$this->instagram_api_data = $instagram_api_data;
	}

	public function get_top_time_stamp() {
		return $this->top_time_stamp;
	}

	public function add_resized_image_to_obj_array( $key, $val ) {
		$this->resized_image_array[ $key ] = $val;
	}

	public function save_in_db( $transient_name = false, $timestamp_override = NULL ) {
		global $wpdb;

		$parsed_data = $this->get_parsed_post_data();

		$timestamp = ! empty( $timestamp_override ) && empty( $parsed_data['timestamp'] ) ? $timestamp_override : $parsed_data['timestamp'];

		$entry_data = array(
			"'" . date( 'Y-m-d H:i:s' ) . "'",
			"'" . esc_sql( $parsed_data['id'] ) . "'",
			"'" . esc_sql( $timestamp ) . "'",
			"'" . esc_sql( json_encode( $this->instagram_api_data ) ) . "'",
			"'pending'",
			"'pending'",
			0,
			"'".date( 'Y-m-d H:i:s' )."'"
		);

		$entry_string = implode( ',',$entry_data );
		$table_name = $wpdb->prefix . SBI_INSTAGRAM_POSTS_TYPE;

		$timestamp_column = 'time_stamp';
		if ( substr( $transient_name, 4, 1 ) === '+') {
			$timestamp_column = 'top_time_stamp';
		}

		$error = $wpdb->query( "INSERT INTO $table_name
      	(created_on,instagram_id,$timestamp_column,json_data,media_id,sizes,images_done,last_requested) VALUES ($entry_string);" );

		if ( $error !== false ) {
			$this->db_id = $wpdb->insert_id;
			$this->insert_sbi_instagram_feeds_posts( $transient_name );
		} else {
			// log error
		}


		return true;

	}

	public function resize_and_save_image( $image_sizes, $upload_dir, $upload_url ) {
		if ( isset( $this->instagram_api_data['id'] ) ) {
			$file_name = '';
			if ( isset( $this->instagram_api_data['thumbnail_url'] ) ) {
				$file_name = $this->instagram_api_data['thumbnail_url'];
			} elseif ( isset( $this->instagram_api_data['media_url'] ) && strpos( $this->instagram_api_data['media_url'], '.mp4?' ) === false ) {
				$file_name = $this->instagram_api_data['media_url'];
			} elseif ( isset( $this->instagram_api_data['media_type'] ) && $this->instagram_api_data['media_type'] === 'CAROUSEL_ALBUM' ) {
				$file_name = '';
				if ( isset( $this->instagram_api_data['children']['data'][0]['media_url'] ) ) {

					foreach ( $this->instagram_api_data['children']['data'] as $child ) {

						if ( empty( $file_name ) && $child['media_type'] === 'IMAGE' ) {
							$file_name = $child['media_url'];
						}

					}

				}

			}


			if ( ! empty( $file_name ) ) {

				// if ! is_wp_error

				$new_file_name = explode( '?', $file_name );
				$new_file_name = basename( $new_file_name[0], '.jpg' );
				$sizes         = array(
					'height' => 1,
					'width'  => 1
				);
				$i             = 1;
                $successful_image_resize = false;

                foreach ( $image_sizes as $size ) {

					$suffix = '';
					if ( $i === 3 ) {
						$suffix = 'thumb';
					} elseif ( $i === 2 ) {
						$suffix = 'low';
					} elseif ( $i === 1 ) {
						$suffix = 'full';
					}

					$this_image_file_name = $new_file_name . $suffix . '.jpg';
					$image_editor         = wp_get_image_editor( $file_name );

					if ( ! is_wp_error( $image_editor ) ) {
						$sizes                = $image_editor->get_size();

						$image_editor->resize( $size, null );

						$full_file_name = trailingslashit( $upload_dir ) . $this_image_file_name;

						$saved_image = $image_editor->save( $full_file_name );

						if ( ! $saved_image ) {
							global $sb_instagram_posts_manager;

							$sb_instagram_posts_manager->add_error( 'image_editor_save', array( __( 'Error saving edited image.', 'instagram-feed' ), $full_file_name ) );
						} else {
                            $successful_image_resize = true;
                        }
					} else {
						global $sb_instagram_posts_manager;

						$message = __( 'Error editing image.', 'instagram-feed' );
                        if ( isset( $image_editor ) && isset( $image_editor->errors ) ) {
                            foreach ( $image_editor->errors as $key => $item ) {
                                $message .= ' '.$key . '- ' . $item[0] . ' |';
                            }
                        }

						$sb_instagram_posts_manager->add_error( 'image_editor', array( $message, $file_name ) );
					}

					$i ++;
				}

				if ( $successful_image_resize ) {

                    $aspect_ratio = round(  $sizes['width'] / $sizes['height'], 2 );


                    $this->update_sbi_instagram_posts( array(
                        'media_id'     => $new_file_name,
                        'sizes'        => implode( ',', $image_sizes ),
                        'aspect_ratio' => $aspect_ratio,
                        'images_done'  => 1
                    ) );

                    $this->add_resized_image_to_obj_array( 'id', $new_file_name );

                }

				// add resized image reference to post meta

				$this->add_resized_image_to_obj_array( 'ratio', $aspect_ratio );
			} elseif ( isset( $this->instagram_api_data['media_type'] ) && ($this->instagram_api_data['media_type'] === 'CAROUSEL_ALBUM' || $this->instagram_api_data['media_type'] === 'VIDEO') ) {
				$this->update_sbi_instagram_posts( array(
					'media_id'     => 'video',
					'sizes'        => '',
					'aspect_ratio' => 1,
					'images_done'  => 1
				) );
			}

		}
	}

	public function get_resized_image_array() {
		if ( empty( $this->resized_image_array ) ) {
			global $wpdb;

			$posts_table_name = $wpdb->prefix . SBI_INSTAGRAM_POSTS_TYPE;
			$stored = $wpdb->get_results( $wpdb->prepare( "SELECT media_id, aspect_ratio FROM $posts_table_name
			WHERE instagram_id = %s 
			LIMIT 1", $this->instagram_post_id ), ARRAY_A );

			if ( isset( $stored[0] ) ) {
				$return = array(
					'id' => $stored[0]['media_id'],
					'ratio' => $stored[0]['aspect_ratio']
				);
				$this->resized_image_array = $return;
				return $return;
			} else {
				return array();
			}
		} else {
			return $this->resized_image_array;
		}
	}
	
	public function update_db_data( $update_last_requested = true, $transient_name = false, $image_sizes, $upload_dir, $upload_url, $timestamp_for_update = false ) {

		if ( empty( $this->db_id ) ) {
			return false;
		}

		$to_update = array(
			'json_data' => json_encode( $this->instagram_api_data )
		);

		if ( $update_last_requested ) {
			$to_update['last_requested'] = date( 'Y-m-d H:i:s' );
		}

		if ( $timestamp_for_update ) {
			$to_update['top_time_stamp'] = $timestamp_for_update;
		}

		if ( $transient_name ) {
			$this->maybe_add_feed_id( $transient_name );
		}

		if ( $this->media_id === 'pending' ) {
			$this->resize_and_save_image( $image_sizes, $upload_dir, $upload_url );
		} else {
			$this->update_sbi_instagram_posts( $to_update );
		}

		return true;
	}

	public function update_sbi_instagram_posts( $to_update ) {
		global $wpdb;
		$table_name = $wpdb->prefix . SBI_INSTAGRAM_POSTS_TYPE;

		foreach ( $to_update as $column => $value ) {
			$query = $wpdb->query( $wpdb->prepare( "UPDATE $table_name
			SET $column = %s
			WHERE id = %d;", $value, $this->db_id ) );

			if ( $query === false ) {
				global $sb_instagram_posts_manager;
				$error = $wpdb->last_error;
				$query = $wpdb->last_query;

				$sb_instagram_posts_manager->add_error( 'database_update_post', array( __( 'Error updating post.', 'instagram-feed' ), $error . '<br><code>' . $query . '</code>' ) );
			}
		}

	}

	private function insert_sbi_instagram_feeds_posts( $transient_name ) {
		global $wpdb;
		$table_name = $wpdb->prefix . SBI_INSTAGRAM_FEEDS_POSTS;

		$entry_data = array(
			$this->db_id,
			"'" . esc_sql( $this->instagram_api_data['id'] ) . "'",
			"'" . esc_sql( $transient_name ) . "'"
		);
		$entry_string = implode( ',',$entry_data );

		$error = $wpdb->query( "INSERT INTO $table_name
      	(id,instagram_id,feed_id) VALUES ($entry_string);" );

		if ( $error !== false ) {
			return $wpdb->insert_id;
		} else {
			global $sb_instagram_posts_manager;
			$error = $wpdb->last_error;
			$query = $wpdb->last_query;

			$sb_instagram_posts_manager->add_error( 'database_insert_post', array( __( 'Error inserting post.', 'instagram-feed' ), $error . '<br><code>' . $query . '</code>' ) );
		}
	}

	// update_last_requested

	private function get_parsed_post_data( $all = true ) {

		$instagram_post_id = isset( $this->instagram_api_data['id'] ) ? $this->instagram_api_data['id'] : '';
		$comments_count = isset( $this->instagram_api_data['comments_count'] ) ? $this->instagram_api_data['comments_count'] : '';
		$like_count = isset( $this->instagram_api_data['like_count'] ) ? $this->instagram_api_data['like_count'] : '';

		$parsed_data = array(
			'comments_count' => $comments_count,
			'like_count' => $like_count
		);

		if ( $all ) {
			$caption = isset( $this->instagram_api_data['caption'] ) ? $this->instagram_api_data['caption'] : '';
			$media_url = isset( $this->instagram_api_data['media_url'] ) ? $this->instagram_api_data['media_url'] : '';
			$media_type = isset( $this->instagram_api_data['media_type'] ) ? $this->instagram_api_data['media_type'] : '';

			$timestamp = '';
			if ( isset( $this->instagram_api_data['timestamp'] ) ) {
				$timestamp_parts = explode( ' ', $this->instagram_api_data['timestamp'] );
				$timestamp = str_replace( 'T', ' ', $timestamp_parts[0] );
			}

			$username = isset( $this->instagram_api_data['username'] ) ? $this->instagram_api_data['username'] : '';
			$permalink = isset( $this->instagram_api_data['permalink'] ) ? $this->instagram_api_data['permalink'] : '';
			$children = isset( $this->instagram_api_data['children'] ) ? json_encode( $this->instagram_api_data['children'] ) : '';

			$parsed_data['caption'] = $caption;
			$parsed_data['media_url'] = $media_url;
			$parsed_data['id'] = $instagram_post_id;
			$parsed_data['media_type'] = $media_type;
			$parsed_data['timestamp'] = $timestamp;
			$parsed_data['username'] = $username;
			$parsed_data['permalink'] = $permalink;
			$parsed_data['children'] = $children;
		}

		return $parsed_data;
	}

	private function maybe_add_feed_id( $feed_id ) {

		if ( empty( $this->instagram_post_id ) ) {
			return;
		}

		global $wpdb;
		$table_name = $wpdb->prefix . SBI_INSTAGRAM_FEEDS_POSTS;

		$feed_id_match = $wpdb->get_col( $wpdb->prepare( "SELECT feed_id FROM $table_name WHERE feed_id = %s AND instagram_id = %s", $feed_id, $this->instagram_post_id ) );

		if ( ! isset( $feed_id_match[0] ) ) {
			$entry_data = array(
				$this->db_id,
				"'" . esc_sql( $this->instagram_post_id ) . "'",
				"'" . esc_sql( $feed_id ) . "'"
			);
			$entry_string = implode( ',',$entry_data );
			$error = $wpdb->query( "INSERT INTO $table_name
      		(id,instagram_id,feed_id) VALUES ($entry_string);" );
		}
	}

	private function is_from_instagram_cdn( $image_url ) {
		return strpos( 'https://scontent.xx.fbcdn.net/', $image_url ) === 0;
	}
}