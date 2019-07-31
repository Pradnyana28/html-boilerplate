<?php
/**
 * Programs page open.
 *
 * @package understrap
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$subtitle  = get_field( 'subtitle' );
$lastTerm  = get_last_term( $post, 'departments' );
$termLink  = get_term_link( $lastTerm, 'departments' );

?>

<div class="cestm-wrapper shadow mt-5-on-mobile no-shadow-on-mobile">
    <div class="overflow-hidden br-4 no-br-on-mobile">
    <div class="cestm-breadcrumbs">
        <?php echo cestm_breadcrumbs( $post, 'departments' ) ?>
    </div>

    <div class="p-4">
        <a href="<?= $termLink ?>" class="btn btn-default-outline mb-4 no-br pl-5 pr-5"><?= $lastTerm->name ?></a>
        <h2 class="text-uppercase mb-3"><?= $post->post_title ?> <?php if ( $subtitle ): echo '<span class="default-color"> - '. $subtitle .'</span>'; endif; ?></h2>
