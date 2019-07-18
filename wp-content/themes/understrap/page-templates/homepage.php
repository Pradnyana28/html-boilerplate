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
// First Section
$title_one       = get_field( 'title_one' );
$subtitle_one    = get_field( 'subtitle_one' );
$tagline_one     = get_field( 'tagline_one' );
$description_one = get_field( 'description_one' );
$link_one        = get_field( 'link_one' );
$image_one       = get_field( 'section_etudier' )[ 'image_one' ];
// Second Section
$title_two       = get_field( 'title_two' );
$subtitle_two    = get_field( 'subtitle_two' );
$tagline_two     = get_field( 'tagline_two' );
$description_two = get_field( 'description_two' );
$link_two        = get_field( 'link_two' );
$image_two       = get_field( 'section_decouvrir' )[ 'image_two' ];
// program
$show_program    = get_field( 'show_program' );
$locations       = get_field( 'locations' );
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
                        <h2 class="section-subtitle default-color text-uppercase"><?= $subtitle_one ?></h2>
                        <h1 class="section-title text-uppercase"><?= $title_one ?></h1>
                        <h3 class="section-tagline default-color text-uppercase"><?= $tagline_one ?></h3>
                        <p><?= $description_one ?></p>
                        <?php if ( $link_one ): ?>
                            <div class="d-block">
                                <a href="<?= $link_one[ 'url' ] ?>" target="<?= $link_one[ 'target' ] ?>" class="text-uppercase btn btn-default btn-hover-outline"><?= $link_one[ 'title' ] ?></a>
                            </div>
                        <?php endif; ?>

                        <!-- image illustration -->
                        <?php if( $image_one ): ?>
                            <img src="<?= $image_one[ 'sizes' ][ 'medium' ] ?>" alt="<?= $image_one[ 'caption' ] ?>" class="section-image align-left">
                        <?php endif; ?>
                    </div>
                </div>

                <!-- right side -->
                <div class="col-md-6">
                    <div class="section">
                        <!-- image illustration -->
                        <?php if ( $image_two ): ?>
                        <div class="align-right">
                            <img src="<?= $image_two[ 'sizes' ][ 'medium' ] ?>" alt="<?= $image_two[ 'caption' ] ?>" class="section-image image-2x">
                        </div>
                        <?php endif; ?>
                        <div class="mt-5">
                            <h2 class="section-subtitle mb-4"><?= $subtitle_two ?></h2>
                            <p class="mb-4"><?= $description_two ?></p>
                            <?php if( $link_two ): ?>
                                <a href="<?= $link_two[ 'url' ] ?>" class="text-uppercase btn btn-default btn-hover-outline" target="<?= $link_two[ 'target' ] ?>"><?= $link_two[ 'title' ] ?></a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <?php if ( $show_program ): ?>
            <div class="container mt-5">
                <h2 class="text-uppercase text-bold text-center">Nos Programmes D'etudes</h2>

                <?php echo display_post_shortcode( [], $show_program ) ?>
            </div>
        <?php endif; ?>

        
	</main><!-- #main -->

</div><!-- #full-width-page-wrapper -->

<?php get_footer(); ?>
