<?php
// Don't load directly
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

class SB_Instagram_Feed
{
	private $standard_transient_name;

	private $fpl_transient_name;

	private $header_transient_name;

	private $backup_feed_transient_name;

	private $time_stamp_column;

	private $whole_post_cache;

	public function __construct( $transient_name, $feed_type = 'user', $user_ids = '', $num = 0 ) {
		// set header and feed transient name
		$this->feed_type = $feed_type;
		$this->fpl_num_posts = $num;
		$this->standard_transient_name = $transient_name;
		$this->fpl_transient_name = SBI_FPL_PREFIX.$transient_name;
		$this->backup_feed_transient_name = SBI_BACKUP_PREFIX . $transient_name;
		$this->use_backup_transient_name = SBI_USE_BACKUP_PREFIX . $transient_name;

		if ( substr( $transient_name, 4, 1 ) === '+') {
			$this->time_stamp_column = 'top_time_stamp';
		} else {
			$this->time_stamp_column = 'time_stamp';
		}

		$sbi_header_transient_name = false;

		if( $feed_type == 'user' ){
			//If it's a user then add the header cache check to the feed
			$sbi_header_transient_name = str_replace( 'sbi_', 'sbi_header_', $transient_name );
			$sbi_header_transient_name = substr($sbi_header_transient_name, 0, 44);
		}

		$this->header_transient_name = $sbi_header_transient_name;

		// set first page load post data if it exists

		// set expiration of transients
	}

	public function get_standard_transient_name() {
		return $this->standard_transient_name;
	}

	public function get_header_transient_name() {
		return $this->header_transient_name;
	}

	public function should_use_feed_cache() {
		$feed_expires = get_option( '_transient_timeout_'.$this->standard_transient_name );

		return ($feed_expires !== false && ($feed_expires - time()) > 60);
	}

	public function should_use_header_cache() {
		$header_expires = get_option( '_transient_timeout_'.$this->header_transient_name );

		return ($header_expires !== false && ($header_expires - time()) > 60);
	}

	public function use_backup_cache_flag_is_set() {
		return (get_transient( $this->use_backup_transient_name ) !== false);
	}

	public function set_whole_post_cache( $data ) {

	}

	public function set_first_page_load_post_set( $data ) {

	}

	public function set_first_page_load_resized_image_data( $data ) {

	}

	public function get_whole_post_cache( $data ) {

	}

	public function get_header_cache( $json_encoded = true ) {
		$header_cache_return = false;
		$header_cache = get_transient( $this->header_transient_name );

		if ( $header_cache ) {
			$header_cache_return = $json_encoded ? urldecode( $header_cache ) : json_decode( urldecode( $header_cache ) );
		}

		return $header_cache_return;
	}

	public function get_first_page_load_json() {
		$fpl_return = get_transient( $this->fpl_transient_name );

		if ( ! $fpl_return ) {

			$to_json = $this->get_resized_images_source_set( $this->fpl_num_posts );

			if ( ! empty ( $to_json ) ) {
				$fpl_return = array(
					'posts'          => array(),
					'resized_images' => $to_json
				);

				$fpl_return = json_encode( $fpl_return );
			}

		}

		return $fpl_return;
	}

	public function get_resized_images_source_set( $num, $offset = 0 ) {
		global $wpdb;

		$posts_table_name = $wpdb->prefix . SBI_INSTAGRAM_POSTS_TYPE;
		$feeds_posts_table_name = $wpdb->prefix . SBI_INSTAGRAM_FEEDS_POSTS;

		$results = $wpdb->get_results( $wpdb->prepare( "SELECT p.media_id, p.instagram_id, p.aspect_ratio FROM $posts_table_name AS p INNER JOIN $feeds_posts_table_name AS f ON p.id = f.id 
			WHERE f.feed_id = %s 
			ORDER BY p.time_stamp
			DESC LIMIT %d, %d", $this->standard_transient_name, $offset, (int)$num ), ARRAY_A );

		$return = array();
		if ( !empty( $results ) && is_array( $results ) ) {

			foreach ( $results as $result ) {
				$return[ $result['instagram_id'] ] = array(
					'id' => $result['media_id'],
					'ratio' => $result['aspect_ratio']
				);
			}

		}

		return $return;
	}

	public function get_earliest_time_stamp() {
		global $wpdb;

		$posts_table_name = $wpdb->prefix . SBI_INSTAGRAM_POSTS_TYPE;
		$feeds_posts_table_name = $wpdb->prefix . SBI_INSTAGRAM_FEEDS_POSTS;

		$results = $wpdb->get_col( $wpdb->prepare( "SELECT p.$this->time_stamp_column FROM $posts_table_name AS p INNER JOIN $feeds_posts_table_name AS f ON p.id = f.id 
			WHERE f.feed_id = %s 
			ORDER BY p.$this->time_stamp_column
			ASC LIMIT 1", $this->standard_transient_name ) );

		$return = isset( $results[0] ) ? $results[0] : date( 'Y-m-d H:i:s' );

		return $return;
	}

	public function get_time_stamp_by_id( $id ) {
		global $wpdb;

		$posts_table_name = $wpdb->prefix . SBI_INSTAGRAM_POSTS_TYPE;
		$feeds_posts_table_name = $wpdb->prefix . SBI_INSTAGRAM_FEEDS_POSTS;

		if ( ! empty( $id ) ) {
			$results = $wpdb->get_col( $wpdb->prepare( "SELECT p.$this->time_stamp_column FROM $posts_table_name AS p INNER JOIN $feeds_posts_table_name AS f ON p.id = f.id 
			WHERE f.feed_id = %s
			AND p.id = %s
			ORDER BY p.$this->time_stamp_column
			ASC LIMIT 1", $this->standard_transient_name, $id  ) );
		}

		$return = isset( $results[0] ) ? $results[0] : date( 'Y-m-d H:i:s' );

		return $return;
	}

	public function create_post_set_from_db( $prepend_posts, $offset, $not_id, $max_timestamp ) {
		global $wpdb;

		$posts_table_name = $wpdb->prefix . SBI_INSTAGRAM_POSTS_TYPE;
		$feeds_posts_table_name = $wpdb->prefix . SBI_INSTAGRAM_FEEDS_POSTS;

		$num_posts = SBI_POSTS_PER_REQUEST - count( $prepend_posts );

		$results = $wpdb->get_col( $wpdb->prepare( "SELECT p.json_data FROM $posts_table_name AS p INNER JOIN $feeds_posts_table_name AS f ON p.id = f.id 
			WHERE f.feed_id = %s
			AND p.id != %s
			AND p.$this->time_stamp_column < '$max_timestamp'
			ORDER BY p.$this->time_stamp_column
			DESC LIMIT %d, %d", $this->standard_transient_name, $not_id, $offset, $num_posts ) );

		$post_set = array();
		foreach( $prepend_posts as $post ) {
			$post_set[] = json_encode( $post );
		}

		if ( isset( $results[0] ) ) {
			$post_set = array_merge( $post_set, $results );
		}

		return $post_set;
	}

}