<?php
/**
 * Theme basic shortcode.
 *
 * @package kesato
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! function_exists( 'display_post_shortcode' ) ) {
	/**
	 * Adds display post shortcode
	 */
	function display_post_shortcode( $attr = [] ) {
		ob_start();
		$attributes = shortcode_atts( [
			'display' => 3,
			'order' => 'descending'
		], $attr );

		$posts = get_posts( [ 'numberposts' => $attributes['display'], 'order' => $attributes['order'] ] );
		require_once get_theme_file_path() .'/loop-templates/post.php';
		return ob_get_clean();
	}

	add_shortcode( 'kesato-post', 'display_post_shortcode' );
}