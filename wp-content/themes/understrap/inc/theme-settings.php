<?php
/**
 * Check and setup theme's default settings
 *
 * @package understrap
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! function_exists( 'understrap_setup_theme_default_settings' ) ) {
	function understrap_setup_theme_default_settings() {

		// check if settings are set, if not set defaults.
		// Caution: DO NOT check existence using === always check with == .
		// Latest blog posts style.
		$understrap_posts_index_style = get_theme_mod( 'understrap_posts_index_style' );
		if ( '' == $understrap_posts_index_style ) {
			set_theme_mod( 'understrap_posts_index_style', 'default' );
		}

		// Sidebar position.
		$understrap_sidebar_position = get_theme_mod( 'understrap_sidebar_position' );
		if ( '' == $understrap_sidebar_position ) {
			set_theme_mod( 'understrap_sidebar_position', 'right' );
		}

		// Container width.
		$understrap_container_type = get_theme_mod( 'understrap_container_type' );
		if ( '' == $understrap_container_type ) {
			set_theme_mod( 'understrap_container_type', 'container' );
		}
	}
}

if ( ! function_exists( 'cestm_breadcrumbs' ) ) {
	function cestm_breadcrumbs( $post, $taxonomy ) {
		ob_start();
		$term_ids = wp_get_post_terms( $post->ID, $taxonomy, array(
			'fields'  => 'ids',
		) );
		$terms = get_terms( $taxonomy, array(
			'include'    => $term_ids,
			'orderby'    => 'term_order',
			'order'      => 'ASC',
			'hide_empty' => false
		) );
		$links = array();
		foreach ( $terms as $term ) {
			$link =  $link = get_term_link( $term, $taxonomy );
			$links[] = sprintf(
				'<li class="with-hover"><a href="%s" rel="tag" class="text-white">%s</a></li>',
				esc_attr( $link ),
				esc_html( $term->name )
			);
		}
		$links[] = "<li class='hide-on-mobile'>{$post->post_title}</li>";
		echo '<ul>';
		echo implode( '', $links );
		echo '</ul>';
		return ob_get_clean();
	}
}