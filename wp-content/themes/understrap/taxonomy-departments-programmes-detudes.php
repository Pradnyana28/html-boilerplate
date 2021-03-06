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

//get the current object
$current = get_queried_object();
$discovers = get_field( 'discover_section', 'option' );
$is_technic_program = get_field( 'is_technic_program', $current );
$program_study = get_field( 'program_study', $current );

// return the ID of the current term
$current_term_id = $current->term_id;

// return the nicename of the current term
$current_name = $current->name;

// returns the current taxonomy slug we are in
$current_taxonomy = $current->taxonomy;

// returns the ID of the parent, if we have a parent
// $current_parent = $current->parent;

$techniquesID = get_term_by( 'name', 'techniques', 'departments' )->term_id;
$sub_terms = get_terms( array(
    'taxonomy'      => $current_taxonomy,
    'child_of'      => $techniquesID,
    'hide_empty'    => false,
) );

$preUniversityID = get_term_by( 'name', 'pre-university', 'departments' )->term_id;
$pre_terms = get_terms( array(
    'taxonomy'      => $current_taxonomy,
    'child_of'      => $preUniversityID,
    'hide_empty'    => false,
) );

?>

<div class="wrapper" id="full-width-page-wrapper">
	<div class="container mb-5 programs-benefit no-pl-on-mobile no-pr-on-mobile mt-5-on-mobile">
        <div class="cestm-wrapper">
            <div class="overflow-hidden br-4 no-br-on-mobile">
            <div class="cestm-breadcrumbs">
                <?php show_breadcrumb($current->slug, $current->taxonomy, true); ?>
            </div>
        </div>
    </div>

    <div class="p-4">
        <h2 class="text-uppercase default-color"><?php the_field( 'title', $current ) ?></h2>
        <div class="entry-content">
            <?php the_field( 'content', $current ) ?>
        </div>
    </div>

    <?php if ( $is_technic_program ): ?>
    <!-- technic -->
    <div id="accordion" class="cestm-collapse">
        <div class="p-4 collapse-item">
            <a class="collapse-button d-block" data-parent="#accordion" data-toggle="collapse" href="#technique" role="button" aria-expanded="false" aria-controls="technique">
                <?= $program_study['program_technic_title'] ?>
            </a>
            <div class="collapse collapse-content" id="technique">
                <?= $program_study['program_technic_content'] ?>
                <div class="row">
                    <div class="col-md-6 col-sm-12">
                    <?php if ($sub_terms): ?>
                        <select class='form-control custom-select program-selects col-12 w-100'>
                        <?php 
                            foreach ($sub_terms as $sub_term) {
                                if ($sub_term->parent == $techniquesID) {
                                    echo '<option value="'. $sub_term->term_id .'" data-link="'. get_term_link($sub_term) .'">'.$sub_term->name.'</option>';
                                }
                            }
                        ?>
                        <select>
                        <button class="program-button d-block mt-3 btn btn-default btn-hover-outline pl-5 pr-5 col-12"><?= __('See The Programs', 'cestm') ?></button>
                    <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>

        <!-- aec -->
        <div class="p-4 collapse-item">
            <a class="collapse-button d-block" data-parent="#accordion" data-toggle="collapse" href="#pre" role="button" aria-expanded="false" aria-controls="pre">
                <?= $program_study['pre_program_title'] ?>
            </a>
            <div class="collapse collapse-content" id="pre">
                <?= $program_study['pre_program_content'] ?>
                <div class="row">
                    <div class="col-md-6 col-sm-12">
                    <?php if ($pre_terms): ?>
                        <select class='form-control custom-select program-selects col-12 w-100'>
                        <?php 
                            foreach ($pre_terms as $pre_term) {
                                if ($pre_term->parent == $preUniversityID) {
                                    echo '<option value="'. $pre_term->term_id .'" data-link="'. get_term_link($pre_term) .'">'.$pre_term->name.'</option>';
                                }
                            }
                        ?>
                        <select>
                        <button class="program-button d-block mt-3 btn btn-default btn-hover-outline pl-5 pr-5 col-12"><?= __('See The Programs', 'cestm') ?></button>
                    <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <div class="container mb-5">
        <!-- Discover Section -->
        <div class="discover-wrapper mt-5">
            <?php if ($discovers): ?>
            <div class="row section reverse-on-mobile">
                <div class="col-md-6 mt-5-on-mobile">
                    <h1 class="section-title text-uppercase"><?= $discovers['section_title'] ?></h1>
                    <h3 class="section-tagline default-color text-uppercase"><?= $discovers['section_tagline'] ?></h3>
                    <p><?= $discovers['section_description'] ?></p>
                    <?php if ($discovers['section_button']): ?>
                    <div class="d-block">
                        <a href="<?= $discovers['section_button']['url'] ?>" target="<?= $discovers['section_button']['target'] ?>" class="text-uppercase btn btn-default btn-hover-outline pl-5 pr-5"><?= $discovers['section_button']['title'] ?></a>
                    </div>
                    <?php endif; ?>
                </div>

                <div class="col-md-6 no-pl-on-mobile no-pr-on-mobile">
                    <img src="<?= $discovers['section_image']['sizes']['medium_large'] ?>" alt="" class="w-100">
                </div>
            </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php get_footer(); ?>