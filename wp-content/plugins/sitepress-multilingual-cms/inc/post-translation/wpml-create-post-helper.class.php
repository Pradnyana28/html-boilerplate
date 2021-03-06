<?php

/**
 * Class WPML_Create_Post_Helper
 *
 * @since 3.2
 */
class WPML_Create_Post_Helper extends WPML_SP_User {

	/**
	 * @param array  $postarr
	 * @param string $lang
	 *
	 * @return int|WP_Error
	 */
	public function insert_post( $postarr, $lang, $wp_error = false ) {
		$current_language = $this->sitepress->get_current_language();
		$this->sitepress->switch_lang( $lang, false );
		if ( isset( $postarr['ID'] ) ) {
			$new_post_id = wp_update_post( $postarr, $wp_error );
		} else {
			add_filter( 'wp_insert_post_empty_content', array( $this, 'allow_empty_post' ), 10, 0 );
			$new_post_id = wp_insert_post( $postarr, $wp_error );
			remove_filter( 'wp_insert_post_empty_content', array( $this, 'allow_empty_post' ) );

		}
		$this->sitepress->switch_lang( $current_language, false );

		return $new_post_id;
	}

	public function allow_empty_post() {
		return false; // We need to return false to indicate that the post is not empty
	}

}