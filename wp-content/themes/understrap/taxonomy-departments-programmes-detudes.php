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
// i.e. ID of term "Photoshop" is "26", so we get "26" if we are viewing "Photoshop"
$current_term_id = $current->term_id;

// return the nicename of the current term
// i.e. returns "Photoshop"
// or "ps-thematic#1" if we are on a child term of "Photoshop"
$current_name = $current->name;

// returns the current taxonomy slug we are in
// i.e. it will return "course"
$current_taxonomy = $current->taxonomy;

// returns the ID of the parent, if we have a parent
// i.e. if we are viewing "ps-thematic#1" it will return the ID of "Photoshop", 26
// if we are viewing "Photoshop", it will return 0, because "Photoshop" is a top level term
#$current_parent = $current->parent;

$sub_terms = get_terms( array(
    'taxonomy'      => $current_taxonomy,
    'child_of'      => 7,
    'hide_empty'    => false,
) );

// only start is some sub terms exist
if ($sub_terms) {
    echo '<ul class="sub-terms">';
    foreach ($sub_terms as $sub_term) {
        // try    to see all available data!
        if ($sub_term->parent == 7) {
            // echo '<li>'.$sub_term->name.'</li>';
        }
    }
    echo '</ul>';
}

?>

<div class="wrapper" id="full-width-page-wrapper">
	<div class="container mb-5 programs-benefit">
        <div class="cestm-wrapper">
            <div class="overflow-hidden br-4">
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
                        <select class='form-control custom-select program-selects col-12 w-100'>
                        <?php 
                            foreach ($sub_terms as $sub_term) {
                                // try    to see all available data!
                                if ($sub_term->parent == 7) {
                                    // print_r($sub_term);
                                    // echo get_term_link($sub_term);
                                    echo '<option value="'. $sub_term->term_id .'" data-link="'. get_term_link($sub_term) .'">'.$sub_term->name.'</option>';
                                }
                            }
                        ?>
                        <select>
                        <button class="program-button d-block mt-3 btn btn-default btn-hover-outline pl-5 pr-5 col-12">Voir le programme</button>
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
                        <?php get_post_by_taxonomy( ['pre'], $current->taxonomy ) ?>
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
</div>

<?php get_footer(); ?>