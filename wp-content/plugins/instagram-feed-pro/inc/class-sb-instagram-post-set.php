<?php
// Don't load directly
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

class SB_Instagram_Post_Set {
	private $post_data;

	private $resized_image_data_for_set;

	private $upload_dir;

	private $upload_url;

	private $transient_name;

	private $fill_in_timestamp;

	private $first_post_top_time_stamp;

	public function __construct( $post_data, $transient_name = false, $fill_in_timestamp = NULL, $image_sizes = array( '640', '320', '150' ), $upload_dir = NULL, $upload_url = NULL ) {
		$this->post_data = $post_data;

		$this->image_sizes = $image_sizes;

		if ( ! isset( $upload_dir ) || ! isset( $upload_url ) ) {
			$upload = wp_upload_dir();
			$upload_dir = $upload['basedir'];
			$upload_dir = trailingslashit( $upload_dir ) . SBI_UPLOADS_NAME;

			$upload_url = trailingslashit( $upload['baseurl'] ) . SBI_UPLOADS_NAME;
		}

		$this->upload_dir = $upload_dir;

		$this->upload_url = $upload_url;

		$this->transient_name = $transient_name;

		$this->fill_in_timestamp = $fill_in_timestamp;
	}

	public function get_post_data() {
		if ( is_array( $this->post_data ) ) {
			return $this->post_data;
		} else {
			return array();
		}
	}

	public function get_resized_image_data_for_set() {
		return $this->resized_image_data_for_set;
	}

	public function maybe_save_update_and_resize_images_for_posts() {
		$posts_iterated_through = 0;
		$number_resized = 0;
		$number_updated = 0;
		$resized_image_data_for_set = array();
		global $sb_instagram_posts_manager;
		$resizing_disabled = $sb_instagram_posts_manager->image_resizing_disabled() || $sb_instagram_posts_manager->max_resizing_per_time_period_reached();
		$is_top_post_feed = (substr( $this->transient_name, 4, 1 ) === '+');

		foreach ( $this->post_data as $single_instagram_post_data ) {

			if ( $posts_iterated_through < 60 && $this->is_business_post( $single_instagram_post_data ) ) {
				$single_post = new SB_Instagram_Post( $single_instagram_post_data['id'] );
				$single_post->set_instagram_api_data( $single_instagram_post_data );
				$resized_image_data_for_set[ $single_instagram_post_data['id'] ] = array();

				if ( $is_top_post_feed ) {

					if ( empty( $this->first_post_top_time_stamp ) ) {
						$this_post_top_time_stamp = $single_post->get_top_time_stamp();
						if ( empty( $this_post_top_time_stamp ) ) {
							$this->first_post_top_time_stamp = $this->fill_in_timestamp;
						} else {
							$this->first_post_top_time_stamp = $single_post->get_top_time_stamp();
						}

					}

				}

				if ( ! $resizing_disabled ) {

					if ( ! $single_post->exists_in_posts_table() && $number_resized < 30 ) {

						if ( $sb_instagram_posts_manager->max_total_records_reached() ) {
							$sb_instagram_posts_manager->delete_least_used_image();
						}

						if ( $is_top_post_feed ) {
							if ( $single_post->save_in_db( $this->transient_name, date( 'Y-m-d H:i:s', strtotime( $this->first_post_top_time_stamp ) - (120 * $posts_iterated_through) - 1 ) ) ) {
								$single_post->resize_and_save_image( $this->image_sizes, $this->upload_dir, $this->upload_url );
							}
						} else {
							if ( $single_post->save_in_db( $this->transient_name, date( 'Y-m-d H:i:s', strtotime( $this->fill_in_timestamp ) - (120 * $posts_iterated_through) ) ) ) {
								$single_post->resize_and_save_image( $this->image_sizes, $this->upload_dir, $this->upload_url );
							}
						}

						$number_resized++;
					} else {
						if ( $is_top_post_feed ) {
							$single_post->update_db_data( true, $this->transient_name, $this->image_sizes, $this->upload_dir, $this->upload_url, date( 'Y-m-d H:i:s', strtotime( $this->first_post_top_time_stamp ) - (120 * $posts_iterated_through) ) );
						} else {
							$single_post->update_db_data( true, $this->transient_name, $this->image_sizes, $this->upload_dir, $this->upload_url );
						}
						$number_updated++;
					}

					$resized_image_data_for_set[ $single_instagram_post_data['id'] ] = $single_post->get_resized_image_array();
				}

			}

			$posts_iterated_through++;
		}

		$this->resized_image_data_for_set = $resized_image_data_for_set;
	}

	private function is_business_post( $post ) {
		return isset( $post['media_type'] );
	}
}