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

$container = get_theme_mod( 'understrap_container_type' );
$footer_logo = get_field( 'logo' );
$social_facebook = get_field( 'facebook_url' );
$social_instagram = get_field( 'instagram_url' );
$social_twitter = get_field( 'twitter_url' );
?>

<?php get_template_part( 'sidebar-templates/sidebar', 'footerfull' ); ?>

<div class="wrapper" id="wrapper-footer">
	<?php if ( $social_facebook || $social_instagram || $social_twitter ): ?>
	<section class="footer-copyright">
		<div class="<?= esc_attr( $container ); ?> overflow-hidden">
			<div class="pull-right p-3">
				<ul>
					<?php if ( $social_facebook ): ?>
						<li><a href="<?= $social_facebook ?>" target="_blank" class="text-white"><i class="fab fa-facebook-f"></i></a></li>
					<?php endif; ?>
					<?php if ( $social_instagram ): ?>
						<li><a href="<?= $social_instagram ?>" target="_blank" class="text-white"><i class="fab fa-instagram-f"></i></a></li>
					<?php endif; ?>
					<?php if ( $social_twitter ): ?>
						<li><a href="<?= $social_twitter ?>" target="_blank" class="text-white"><i class="fab fa-twitter-f"></i></a></li>
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

