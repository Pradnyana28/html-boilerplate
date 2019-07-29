<?php
/**
 * Understrap functions and definitions
 *
 * @package understrap
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$understrap_includes = array(
	'/theme-settings.php',                  // Initialize theme default settings.
	'/setup.php',                           // Theme setup and custom theme supports.
	'/widgets.php',                         // Register widget area.
	'/enqueue.php',                         // Enqueue scripts and styles.
	'/template-tags.php',                   // Custom template tags for this theme.
	'/pagination.php',                      // Custom pagination for this theme.
	'/hooks.php',                           // Custom hooks.
	'/extras.php',                          // Custom functions that act independently of the theme templates.
	'/customizer.php',                      // Customizer additions.
	'/custom-comments.php',                 // Custom Comments file.
	'/jetpack.php',                         // Load Jetpack compatibility file.
	'/class-wp-bootstrap-navwalker.php',    // Load custom WordPress nav walker.
	'/woocommerce.php',                     // Load WooCommerce functions.
	'/editor.php',                          // Load Editor functions.
	'/deprecated.php',                      // Load deprecated functions.
	'/shortcode.php',                       // Load shortcode functions.
);

foreach ( $understrap_includes as $file ) {
	$filepath = locate_template( 'inc' . $file );
	if ( ! $filepath ) {
		trigger_error( sprintf( 'Error locating /inc%s for inclusion', $file ), E_USER_ERROR );
	}
	require_once $filepath;
}

if ( ! function_exists( 'cestm_acf_init' ) ) {
	add_action('acf/init', 'cestm_acf_init');
	function cestm_acf_init() {
		acf_update_setting('google_api_key', 'AIzaSyAVCm5lyK_cSxByjkYqqsdJrUfmtCB7Elk');
	}
}

if ( ! function_exists( 'google_map_script' ) ) {
	add_action( 'wp_enqueue_scripts', 'google_map_script' );
	function google_map_script() {
		wp_enqueue_script( 'google-api', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAVCm5lyK_cSxByjkYqqsdJrUfmtCB7Elk', null, null, true);
	}
}

function add_file_types_to_uploads($file_types){
	$new_filetypes = array();
	$new_filetypes = [ 'svg' => 'image/svg+xml' ];
	$file_types = array_merge($file_types, $new_filetypes );
	return $file_types;
}
add_action('upload_mimes', 'add_file_types_to_uploads');

// First we check to see if acf_add_options_page is a function.
// If it is not, then we probably do not have ACF Pro installed
if( function_exists('acf_add_options_page') ) {
	// Let's add our Options Page
	acf_add_options_page(array(
		'page_title'    => 'Theme Options',
		'menu_title'    => 'Theme Options',
		'menu_slug'     => 'theme-options',
		'capability'    => 'edit_posts'
	));

	acf_add_options_sub_page(array(
		'page_title'    => 'General Setting',
		'parent_slug'   => 'theme-options',
		'menu_title'    => 'General Setting',
		'menu_slug'     => 'general-setting',
	));

	// If we want to add multiple sections to our Options Page
	// we can do so with an Options Sub Page.
	acf_add_options_sub_page(array(
		'page_title'    => "Register Guides",
		'parent_slug'   => 'theme-options',  // 'menu_slug' on the parent options page
		'menu_title'    => "Register Guides",
		'menu_slug'     => 'register-guides',
	));

	acf_add_options_sub_page(array(
		'page_title'    => 'Discover Montreal',
		'parent_slug'   => 'theme-options',
		'menu_title'    => 'Discover Montreal',
		'menu_slug'     => 'discover-montreal',
	));
}