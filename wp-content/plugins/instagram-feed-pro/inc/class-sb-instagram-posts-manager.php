<?php
// Don't load directly
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

class SB_Instagram_Posts_Manager
{
	var $sbi_options;

	var $limit;

	public function __construct() {
		$this->sbi_options = get_option( 'sb_instagram_settings' );
		$this->errors = get_option( 'sb_instagram_errors', array() );
	}

	public function delete_least_used_image() {
		global $wpdb;
		$table_name = $wpdb->prefix . SBI_INSTAGRAM_POSTS_TYPE;
		$feeds_posts_table_name = esc_sql( $wpdb->prefix . SBI_INSTAGRAM_FEEDS_POSTS );

		$max = isset( $this->limit ) && $this->limit > 1 ? $this->limit : 1;

		$oldest_posts = $wpdb->get_results( "SELECT id, media_id FROM $table_name ORDER BY last_requested ASC LIMIT $max", ARRAY_A );

		$upload = wp_upload_dir();
		$file_suffixes = array( 'thumb', 'low', 'full' );

		foreach ( $oldest_posts as $post ) {

			foreach ( $file_suffixes as $file_suffix ) {
				$file_name = trailingslashit( $upload['basedir'] ) . trailingslashit( SBI_UPLOADS_NAME ) . $post['media_id'] . $file_suffix . '.jpg';
				if ( is_file( $file_name ) ) {
					unlink( $file_name );
				}
			}

			$wpdb->query( $wpdb->prepare( "DELETE FROM $table_name WHERE id = %d", $post['id'] ) );
			$wpdb->query( $wpdb->prepare( "DELETE FROM $feeds_posts_table_name WHERE record_id = %d", $post['id'] ) );
		}

	}

	public function max_total_records_reached() {
		global $wpdb;
		$table_name = $wpdb->prefix . SBI_INSTAGRAM_POSTS_TYPE;

		$num_records = $wpdb->get_var( "SELECT COUNT(*) FROM $table_name" );

		if ( !isset( $this->limit ) && (int)$num_records > 150 ) {
			$this->limit = (int)$num_records - 150;
		}

		return ((int)$num_records > 150);
	}

	public function max_resizing_per_time_period_reached() {
		global $wpdb;
		$table_name = $wpdb->prefix . SBI_INSTAGRAM_POSTS_TYPE;

		$fifteen_minutes_ago = date( 'Y-m-d H:i:s', time() - 15 * 60 );

		$num_new_records = $wpdb->get_var( "SELECT COUNT(*) FROM $table_name WHERE created_on > '$fifteen_minutes_ago'" );

		return ((int)$num_new_records > 30);
	}

	public function image_resizing_disabled() {
		$disable_resizing = isset( $this->sbi_options['sb_instagram_disable_resize'] ) ? $this->sbi_options['sb_instagram_disable_resize'] : false;

		return $disable_resizing;
	}

	// delete_all_sbi_instagram_posts
	public function delete_all_sbi_instagram_posts() {
		$upload = wp_upload_dir();

		global $wpdb;

		$posts_table_name = $wpdb->prefix . SBI_INSTAGRAM_POSTS_TYPE;

		$image_files = glob( trailingslashit( $upload['basedir'] ) . trailingslashit( SBI_UPLOADS_NAME ) . '*'  ); // get all file names
		foreach ( $image_files as $file ) { // iterate files
			if ( is_file( $file ) ) {
				unlink( $file );
			} // delete file
		}

		//Delete tables
		$wpdb->query( "DROP TABLE IF EXISTS $posts_table_name" );

		$feeds_posts_table_name = esc_sql( $wpdb->prefix . SBI_INSTAGRAM_FEEDS_POSTS );
		$wpdb->query( "DROP TABLE IF EXISTS $feeds_posts_table_name" );

		$table_name = $wpdb->prefix . "options";

		$wpdb->query( "
			        DELETE
			        FROM $table_name
			        WHERE `option_name` LIKE ('%\_transient\_\$sbi\_%')
			        " );
		$wpdb->query( "
			        DELETE
			        FROM $table_name
			        WHERE `option_name` LIKE ('%\_transient\_timeout\_\$sbi\_%')
			        " );
		delete_option( 'sbi_hashtag_ids' );

		$upload = wp_upload_dir();
		$upload_dir = $upload['basedir'];
		$upload_dir = trailingslashit( $upload_dir ) . SBI_UPLOADS_NAME;
		if ( ! file_exists( $upload_dir ) ) {
			$created = wp_mkdir_p( $upload_dir );
			if ( $created ) {
				$this->remove_error( 'upload_dir' );
			} else {
				$this->add_error( 'upload_dir', array( __( 'There was an error creating the folder for storing resized images.', 'instagram-feed' ), $upload_dir ) );
			}
		} else {
			$this->remove_error( 'upload_dir' );
		}

		sbi_create_database_table();
	}

	public function get_errors() {
		return $this->errors;
	}

	public function add_error( $type, $message_array ) {
		$this->errors[ $type ] = $message_array;

		update_option( 'sb_instagram_errors', $this->errors, false );
	}

	public function remove_error( $type ) {
		unset( $this->errors[ $type ] );

		update_option( 'sb_instagram_errors', $this->errors, false );
	}

}