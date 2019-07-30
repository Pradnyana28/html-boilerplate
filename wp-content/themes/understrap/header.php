<?php
/**
 * The header for our theme.
 *
 * Displays all of the <header> section and everything up till <div id="content">
 *
 * @package understrap
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$container 			= get_theme_mod( 'understrap_container_type' );
$show_extra_button  = get_theme_mod( 'understrap_show_extra_button', true );
$extra_button_name  = get_theme_mod( 'understrap_extra_button_name', 'Contact Us' );
$extra_button_link	= get_theme_mod( 'understrap_extra_button_link', '/contacts' );
$custom_logo_id 	= get_theme_mod( 'custom_logo', 0 );
$navigation_logo 	= wp_get_attachment_image_src( $custom_logo_id, 'full' );
$navigation_logo 	= $navigation_logo[0];
// social accounts
$container 			= get_theme_mod( 'understrap_container_type' );
$social_facebook 	= get_theme_mod( 'understrap_social_facebook_account' );
$social_instagram 	= get_theme_mod( 'understrap_social_instagram_account' );
$social_twitter 	= get_theme_mod( 'understrap_social_twitter_account' );
$social_pinterest 	= get_theme_mod( 'understrap_social_pinterest_account' );
$logo_white			= get_field( 'logo_white', 'options' );
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<?php wp_head(); ?>
	<script src="<?= get_template_directory_uri() .'/src/js/cestm/leaflet.js' ?>"></script>
</head>

<body <?php body_class(); ?>>
<!-- Page Preloader -->
<div class="preloader">
	<div class="loader">Loading...</div>
</div>

<?php do_action( 'wp_body_open' ); ?>
<header class="kst-header" id="page">
	<?php if ( $navigation_logo ): ?>
		<div class="logo-wrapper fade-in">
			<img src="<?= $navigation_logo ?>" alt="" class="logo">
		</div>
	<?php endif; ?>

	<div class="navbar-top d-flex">
		<div class="container">
			<div class="social-accounts-wrapper pull-right">
				<ul>
					<?php if ( $social_facebook ): ?>
						<li><a href="<?= $social_facebook ?>" target="_blank" class="text-white"><i class="fa fa-facebook"></i></a></li>
					<?php endif; ?>
					<?php if ( $social_instagram ): ?>
						<li><a href="<?= $social_instagram ?>" target="_blank" class="text-white"><i class="fa fa-instagram"></i></a></li>
					<?php endif; ?>
					<?php if ( $social_twitter ): ?>
						<li><a href="<?= $social_twitter ?>" target="_blank" class="text-white"><i class="fa fa-twitter"></i></a></li>
					<?php endif; ?>
					<?php if ( $social_pinterest ): ?>
						<li><a href="<?= $social_pinterest ?>" target="_blank" class="text-white"><i class="fa fa-twitter"></i></a></li>
					<?php endif; ?>
				</ul>
			</div>
			<?php wp_nav_menu(
				array(
					'theme_location'  => 'topbar',
					'container_class' => '',
					'container_id'    => 'navbar-top-menu',
					'menu_class'      => '',
					'fallback_cb'     => '',
					'menu_id'         => 'topbar-menu',
					'depth'           => 2,
					'walker'          => new Understrap_WP_Bootstrap_Navwalker(),
				)
			); ?>
		</div>
	</div>

	<!-- ******************* The Navbar Area ******************* -->
	<div id="wrapper-navbar" itemscope itemtype="http://schema.org/WebSite">
		<a class="skip-link sr-only sr-only-focusable" href="#content"><?php esc_html_e( 'Skip to content', 'understrap' ); ?></a>

		<nav class="main-menu">
			<?php if ( 'container' == $container ) : ?>
			<div class="container">
			<?php endif; ?>

				<div class="row d-flex">
					<div class="col-xl-3 col-lg-4 col-md-12">
						<button class="menu-button d-block d-lg-none navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="<?php esc_attr_e( 'Toggle navigation', 'understrap' ); ?>">
							<span></span>
							<span></span>
							<span></span>
						</button>
					</div>
			
					<div class="col-xl-<?= $show_extra_button ? '7' : '9' ?> d-flex align-items-center col-lg-8 col-md-12">
						<!-- The WordPress Menu goes here -->
						<div id="white-logo" class="hide-on-mobile hide-on-desktop">
							<img src="<?= $logo_white['sizes']['medium_large'] ?>" alt="">
						</div>
						<?php wp_nav_menu(
							array(
								'theme_location'  => 'primary',
								'container_class' => 'main-menu d-lg-block hide-on-mobile',
								'container_id'    => '',
								'menu_class'      => '',
								'fallback_cb'     => '',
								'menu_id'         => '',
								'depth'           => 2,
								'walker'          => new Understrap_WP_Bootstrap_Navwalker(),
							)
						); ?>
						<?php wp_nav_menu(
							array(
								'theme_location'  => 'mobile-menu',
								'container_class' => 'main-menu collapse hide-on-desktop',
								'container_id'    => 'navbarNavDropdown',
								'menu_class'      => 'mobileMenuWrapper',
								'fallback_cb'     => '',
								'menu_id'         => 'main-menu',
								'depth'           => 2,
								'walker'          => new Understrap_WP_Bootstrap_Navwalker(),
							)
						); ?>
					</div>
			
					<?php if ( $show_extra_button ): ?>
						<div class="col-xl-2 col-lg-2 d-flex align-items-center">
							<a href="<?= $extra_button_link ?>" class="contact-us-btn btn d-block w-100 btn-default-outline"><?= $extra_button_name ?></a>
						</div>
					<?php endif; ?>
				</div>

			<?php if ( 'container' == $container ) : ?>
			</div><!-- .container -->
			<?php endif; ?>
		</nav>

</header><!-- #wrapper-navbar end -->
