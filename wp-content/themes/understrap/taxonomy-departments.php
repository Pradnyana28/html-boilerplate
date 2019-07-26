<?php
/**
 * Template Name: Programs Page
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
$q = get_queried_object();
$discovers = get_field( 'discover_section', 'option' );
?>

<div class="wrapper" id="full-width-page-wrapper">
	<div class="container mb-5">
        <div class="cestm-wrapper">
            <div class="overflow-hidden br-4">
            <div class="cestm-breadcrumbs">
                <?php show_breadcrumb($q->slug, $q->taxonomy); ?>
            </div>
        </div>

        <div class="p-4">
            <h2 class="text-uppercase"><?php the_field( 'title', $q ) ?></h2>
            <div class="entry-content">
                <?php the_field( 'content', $q ) ?>
            </div>
        </div>
    </div>

    <div class="container mb-5">
        <!-- Discover Section -->
        <div class="discover-wrapper mt-5">
            <?php if ($discovers): ?>
            <div class="row section">
                <div class="col-md-6">
                    <h1 class="section-title text-uppercase"><?= $discovers['section_title'] ?></h1>
                    <h3 class="section-tagline default-color text-uppercase"><?= $discovers['section_tagline'] ?></h3>
                    <p><?= $discovers['section_description'] ?></p>
                    <?php if ($discovers['section_button']): ?>
                    <div class="d-block">
                        <a href="<?= $discovers['section_button']['url'] ?>" target="<?= $discovers['section_button']['target'] ?>" class="text-uppercase btn btn-default btn-hover-outline pl-5 pr-5"><?= $discovers['section_button']['title'] ?></a>
                    </div>
                    <?php endif; ?>
                </div>

                <div class="col-md-6">
                    <img src="<?= $discovers['section_image']['sizes']['medium_large'] ?>" alt="" class="w-100">
                </div>
            </div>
            <?php endif; ?>
        </div>
    </div>
</div><!-- #full-width-page-wrapper -->

<?php get_footer(); ?>
