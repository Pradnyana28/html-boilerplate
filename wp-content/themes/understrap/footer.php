<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package understrap
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$container 			= get_theme_mod( 'understrap_container_type' );
$social_facebook 	= get_theme_mod( 'understrap_social_facebook_account' );
$social_instagram 	= get_theme_mod( 'understrap_social_instagram_account' );
$social_twitter 	= get_theme_mod( 'understrap_social_twitter_account' );
$social_pinterest 	= get_theme_mod( 'understrap_social_pinterest_account' );
?>

<?php get_template_part( 'sidebar-templates/sidebar', 'footerfull' ); ?>

<div class="wrapper p-0" id="wrapper-footer">
	<?php if ( $social_facebook || $social_instagram || $social_twitter ): ?>
	<section class="footer-copyright">
		<div class="<?= esc_attr( $container ); ?> overflow-hidden">
			<div class="pull-right p-3">
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
		</div>
	</section>
	<?php endif; ?>
</div><!-- wrapper end -->

</div><!-- #page we need this extra closing tag here -->

<?php wp_footer(); ?>

</body>

</html>

