<?php
/**
 * Programs page open.
 *
 * @package understrap
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$subtitle = get_field( 'subtitle' );
$tagline  = get_field( 'tagline' );
$month    = get_field( 'month' );
?>

<div class="cestm-wrapper shadow">
    <div class="overflow-hidden br-4">
    <div class="cestm-breadcrumbs">
        <?php echo cestm_breadcrumbs( $post, 'departments' ) ?>
    </div>

    <div class="p-4">
        <?php if ( $month ): ?>
            <span class="btn btn-default-outline mb-4 no-br pl-5 pr-5"><?= $month ?></span>
        <?php endif; ?>
        <h2 class="text-uppercase mb-3"><?= $post->post_title ?> <?php if ( $subtitle ): echo '<span class="default-color"> - '. $subtitle .'</span>'; endif; ?></h2>
        <?php if ( $tagline ): ?>
            <h3 class="default-color"><?= $tagline ?></h3>
        <?php endif; ?>
