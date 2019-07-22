<?php
/**
 * Understrap Theme Customizer
 *
 * @package understrap
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
if ( ! function_exists( 'understrap_customize_register' ) ) {
	/**
	 * Register basic customizer support.
	 *
	 * @param object $wp_customize Customizer reference.
	 */
	function understrap_customize_register( $wp_customize ) {
		$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
		$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
		$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';
	}
}
add_action( 'customize_register', 'understrap_customize_register' );

if ( ! function_exists( 'understrap_theme_customize_register' ) ) {
	/**
	 * Register individual settings through customizer's API.
	 *
	 * @param WP_Customize_Manager $wp_customize Customizer reference.
	 */
	function understrap_theme_customize_register( $wp_customize ) {

		// Theme layout settings.
		$wp_customize->add_section(
			'understrap_theme_layout_options',
			array(
				'title'       => __( 'Theme Layout Settings', 'understrap' ),
				'capability'  => 'edit_theme_options',
				'description' => __( 'Container width and sidebar defaults', 'understrap' ),
				'priority'    => 160,
			)
		);

		/**
		 * Select sanitization function
		 *
		 * @param string               $input   Slug to sanitize.
		 * @param WP_Customize_Setting $setting Setting instance.
		 * @return string Sanitized slug if it is a valid choice; otherwise, the setting default.
		 */
		function understrap_theme_slug_sanitize_select( $input, $setting ) {

			// Ensure input is a slug (lowercase alphanumeric characters, dashes and underscores are allowed only).
			$input = sanitize_key( $input );

			// Get the list of possible select options.
			$choices = $setting->manager->get_control( $setting->id )->choices;

				// If the input is a valid key, return it; otherwise, return the default.
				return ( array_key_exists( $input, $choices ) ? $input : $setting->default );

		}

		$wp_customize->add_setting(
			'understrap_container_type',
			array(
				'default'           => 'container',
				'type'              => 'theme_mod',
				'sanitize_callback' => 'understrap_theme_slug_sanitize_select',
				'capability'        => 'edit_theme_options',
			)
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'understrap_container_type',
				array(
					'label'       => __( 'Container Width', 'understrap' ),
					'description' => __( 'Choose between Bootstrap\'s container and container-fluid', 'understrap' ),
					'section'     => 'understrap_theme_layout_options',
					'settings'    => 'understrap_container_type',
					'type'        => 'select',
					'choices'     => array(
						'container'       => __( 'Fixed width container', 'understrap' ),
						'container-fluid' => __( 'Full width container', 'understrap' ),
					),
					'priority'    => '10',
				)
			)
		);

		$wp_customize->add_setting(
			'understrap_sidebar_position',
			array(
				'default'           => 'right',
				'type'              => 'theme_mod',
				'sanitize_callback' => 'sanitize_text_field',
				'capability'        => 'edit_theme_options',
			)
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'understrap_sidebar_position',
				array(
					'label'             => __( 'Sidebar Positioning', 'understrap' ),
					'description'       => __(
						'Set sidebar\'s default position. Can either be: right, left, both or none. Note: this can be overridden on individual pages.',
						'understrap'
					),
					'section'           => 'understrap_theme_layout_options',
					'settings'          => 'understrap_sidebar_position',
					'type'              => 'select',
					'sanitize_callback' => 'understrap_theme_slug_sanitize_select',
					'choices'           => array(
						'right' => __( 'Right sidebar', 'understrap' ),
						'left'  => __( 'Left sidebar', 'understrap' ),
						'both'  => __( 'Left & Right sidebars', 'understrap' ),
						'none'  => __( 'No sidebar', 'understrap' ),
					),
					'priority'          => '20',
				)
			)
		);
	}
} // endif function_exists( 'understrap_theme_customize_register' ).
add_action( 'customize_register', 'understrap_theme_customize_register' );

if ( ! function_exists( 'understrap_navigation_customize_register' ) ) {
	function understrap_navigation_customize_register( $wp_customize ) {

		// Navigation setting.
		$wp_customize->add_section(
			'understrap_navigation_customize_options',
			array(
				'title'       => __( 'Navigation Options', 'understrap' ),
				'capability'  => 'edit_theme_options',
				'description' => __( 'Add optional setting for navigation', 'understrap' ),
				'priority'    => 161,
			)
		);

		$wp_customize->add_setting(
			'understrap_show_extra_button',
			[
				'default' => true
			]
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'understrap_show_extra_button',
				array(
					'label'       => __( 'Show Extra Button', 'understrap' ),
					'section'     => 'understrap_navigation_customize_options',
					'settings'    => 'understrap_show_extra_button',
					'type'        => 'checkbox',
					'priority'    => '10',
				)
			)
		);

		$wp_customize->add_setting(
			'understrap_extra_button_name',
			[
				'default' => 'Contact Us'
			]
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'understrap_extra_button_name',
				array(
					'label'       => __( 'Extra Button Name', 'understrap' ),
					'section'     => 'understrap_navigation_customize_options',
					'settings'    => 'understrap_extra_button_name',
					'type'        => 'text',
					'priority'    => '10',
				)
			)
		);

		$wp_customize->add_setting(
			'understrap_extra_button_link',
			[
				'default' => '/contact'
			]
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'understrap_extra_button_link',
				array(
					'label'       => __( 'Extra Button Link', 'understrap' ),
					'section'     => 'understrap_navigation_customize_options',
					'settings'    => 'understrap_extra_button_link',
					'type'        => 'text',
					'priority'    => '12',
				)
			)
		);

	}
}
add_action( 'customize_register', 'understrap_navigation_customize_register' );

if ( ! function_exists( 'understrap_social_media_accounts_options' ) ) {
	function understrap_social_media_accounts_options( $wp_customize ) {

		$wp_customize->add_section(
			'understrap_social_media_accounts',
			[
				'title' 		=> __('Social Media Accounts', 'understrap'),
				'capability' 	=> 'edit_theme_options',
				'description' 	=> __( 'Connect your social media account links here.' ),
				'priority'		=> 162
			]
		);

		$wp_customize->add_setting(
			'understrap_social_facebook_account'
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'understrap_social_facebook_account',
				array(
					'label'			=> __( 'Facebook Account URL', 'understrap' ),
					'description'	=> __( 'Full facebook account link' ),
					'section'		=> 'understrap_social_media_accounts',
					'settings'		=> 'understrap_social_facebook_account',
					'type'			=> 'text',
					'priority'		=> '10'
				)
			)
		);

		$wp_customize->add_setting(
			'understrap_social_twitter_account'
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'understrap_social_twitter_account',
				array(
					'label'			=> __( 'Twitter Account URL', 'understrap' ),
					'description'	=> __( 'Full twitter account link' ),
					'section'		=> 'understrap_social_media_accounts',
					'settings'		=> 'understrap_social_twitter_account',
					'type'			=> 'text',
					'priority'		=> '11'
				)
			)
		);

		$wp_customize->add_setting(
			'understrap_social_pinterest_account'
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'understrap_social_pinterest_account',
				array(
					'label'			=> __( 'Pinterest Account URL', 'understrap' ),
					'description'	=> __( 'Full pinterest account link' ),
					'section'		=> 'understrap_social_media_accounts',
					'settings'		=> 'understrap_social_pinterest_account',
					'type'			=> 'text',
					'priority'		=> '12'
				)
			)
		);

		$wp_customize->add_setting(
			'understrap_social_youtube_account'
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'understrap_social_youtube_account',
				array(
					'label'			=> __( 'Youtube Account URL', 'understrap' ),
					'description'	=> __( 'Full youtube account link' ),
					'section'		=> 'understrap_social_media_accounts',
					'settings'		=> 'understrap_social_youtube_account',
					'type'			=> 'text',
					'priority'		=> '13'
				)
			)
		);

		$wp_customize->add_setting(
			'understrap_social_instagram_account'
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'understrap_social_youtube_account',
				array(
					'label'			=> __( 'Instagram Account URL', 'understrap' ),
					'description'	=> __( 'Full instagram account link' ),
					'section'		=> 'understrap_social_media_accounts',
					'settings'		=> 'understrap_social_instagram_account',
					'type'			=> 'text',
					'priority'		=> '14'
				)
			)
		);

	}
}
add_action( 'customize_register', 'understrap_social_media_accounts_options' );

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
if ( ! function_exists( 'understrap_customize_preview_js' ) ) {
	/**
	 * Setup JS integration for live previewing.
	 */
	function understrap_customize_preview_js() {
		wp_enqueue_script(
			'understrap_customizer',
			get_template_directory_uri() . '/js/customizer.js',
			array( 'customize-preview' ),
			'20130508',
			true
		);
	}
}
add_action( 'customize_preview_init', 'understrap_customize_preview_js' );
