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

$container = get_theme_mod( 'understrap_container_type' );
$extra_button = get_field( 'extra_button' );
$navigation_logo = get_field( 'logo' );
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<!-- Page Preloader -->
<div class="preloader">
	<div class="loader">Loading...</div>
</div>

<?php do_action( 'wp_body_open' ); ?>
<header class="kst-header" id="page">
	<?php if ( $navigation_logo ): ?>
		<div class="logo-wrapper">
			<img src="<?= $navigation_logo ?>" alt="" class="logo">
		</div>
	<?php endif; ?>

	<div class="navbar-top d-flex">
		<div class="container">
			<ul>
				<li><a href="/">Menu 1</a></li>
				<li><a href="/">Menu 2</a></li>
			</ul>
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
						<button class="menu-button d-block d-lg-none" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="<?php esc_attr_e( 'Toggle navigation', 'understrap' ); ?>">
							<i class="icofont-navigation-menu"></i>
						</button>
					</div>
			
					<div class="col-xl-<?= $extra_button ? '7' : '9' ?> d-flex align-items-center col-lg-8 col-md-12">
						<!-- The WordPress Menu goes here -->
						<?php wp_nav_menu(
							array(
								'theme_location'  => 'primary',
								'container_class' => 'main-menu d-none d-lg-block d-md-none d-sm-none',
								'container_id'    => 'navbarNavDropdown',
								'menu_class'      => '',
								'fallback_cb'     => '',
								'menu_id'         => 'main-menu',
								'depth'           => 2,
								'walker'          => new Understrap_WP_Bootstrap_Navwalker(),
							)
						); ?>
					</div>
			
					<?php if ( $extra_button ): ?>
						<div class="col-xl-2 col-lg-2 d-flex align-items-center">
							<a href="<?= $extra_button ?>" class="contact-us-btn btn d-block w-100 btn-default-outline">Contact Us</a>
						</div>
					<?php endif; ?>
				</div>

			<?php if ( 'container' == $container ) : ?>
			</div><!-- .container -->
			<?php endif; ?>
		</nav>

</header><!-- #wrapper-navbar end -->
