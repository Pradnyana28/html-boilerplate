<?php
/**
 * Template Name: Home Page
 *
 * Template for displaying a page without sidebar even if a sidebar widget is published.
 *
 * @package understrap
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();
$container = get_theme_mod( 'understrap_container_type' );
?>

<?php if ( is_front_page() ) : ?>
  <?php get_template_part( 'global-templates/hero' ); ?>
<?php endif; ?>


<div class="wrapper" id="full-width-page-wrapper">

	<main class="site-main" id="main" role="main">

		<div class="container mt-5">
            <div class="row">
                <!-- left side -->
                <div class="col-md-6">
                    <div class="section">
                        <h2 class="section-subtitle default-color text-uppercase">Etudier A Montreal</h2>
                        <h1 class="section-title text-uppercase">Au Canada</h1>
                        <h3 class="section-tagline default-color text-uppercase">Votre Tremplin Vers Lavenir</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate eaque quo corporis quisquam inventore ipsum iste corrupti doloremque. Possimus aperiam ducimus tenetur rem temporibus ratione amet nostrum error recusandae repellendus.</p>
                        <a href="/" class="text-uppercase btn btn-default btn-hover-outline">Decouvrir Montreal</a>

                        <!-- image illustration -->
                        <img src="/assets/img/background-one.jpg" alt="" class="section-image align-left">
                    </div>
                </div>

                <!-- right side -->
                <div class="col-md-6">
                    <div class="section">
                        <!-- image illustration -->
                        <div class="align-right">
                            <img src="/assets/img/iStock-1000854594.jpg" alt="" class="section-image image-2x">
                        </div>
                        <div class="mt-5">
                            <h2 class="section-subtitle mb-4"><span class="default-color">Decouvrir</span> Le Campus<br /> D'etudes Superieures<br /> Techniques De Montreal</h2>
                            <p class="mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis quos magnam, minima saepe in sint aperiam, quaerat culpa earum sequi maiores consequatur incidunt itaque deleniti consectetur obcaecati laudantium assumenda delectus.</p>
                            <a href="/" class="text-uppercase btn btn-default btn-hover-outline">En Savoir Plus</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container mt-5">
            <h2 class="text-uppercase text-bold text-center">Nos Programmes D'etudes</h2>

            <?php echo display_post_shortcode() ?>
        </div>

	</main><!-- #main -->

</div><!-- #full-width-page-wrapper -->

<?php get_footer(); ?>
