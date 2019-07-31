<?php
/**
 * Check and setup theme's default settings
 *
 * @package understrap
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! function_exists( 'understrap_setup_theme_default_settings' ) ) {
	function understrap_setup_theme_default_settings() {

		// check if settings are set, if not set defaults.
		// Caution: DO NOT check existence using === always check with == .
		// Latest blog posts style.
		$understrap_posts_index_style = get_theme_mod( 'understrap_posts_index_style' );
		if ( '' == $understrap_posts_index_style ) {
			set_theme_mod( 'understrap_posts_index_style', 'default' );
		}

		// Sidebar position.
		$understrap_sidebar_position = get_theme_mod( 'understrap_sidebar_position' );
		if ( '' == $understrap_sidebar_position ) {
			set_theme_mod( 'understrap_sidebar_position', 'right' );
		}

		// Container width.
		$understrap_container_type = get_theme_mod( 'understrap_container_type' );
		if ( '' == $understrap_container_type ) {
			set_theme_mod( 'understrap_container_type', 'container' );
		}
	}
}

if ( ! function_exists( 'cestm_breadcrumbs' ) ) {
	function cestm_breadcrumbs( $post, $taxonomy ) {
		ob_start();
		$term_ids = wp_get_post_terms( $post->ID, $taxonomy, array(
			'fields'  => 'ids',
		) );
		$terms = get_terms( $taxonomy, array(
			'include'    => $term_ids,
			'orderby'    => 'term_order',
			'order'      => 'ASC',
			'hide_empty' => false
		) );
		$links = array();
		foreach ( $terms as $term ) {
			$is_clickable    = get_field( 'is_clickable', $term );
			$link = get_term_link( $term, $taxonomy );
			$li_class = $is_clickable ? 'with-hover d-flex' : '';
			$li_class .= $term->parent == 0 ? '' : ' hide-on-mobile';
			$link_clickable  = $is_clickable ? '<a href="'. esc_attr( $link ) .'" rel="tag" class="text-white">'. esc_html( $term->name ) .'</a>' : esc_html( $term->name );

			$links[] = sprintf(
				'<li class="%s">%s</li>',
				$li_class,
				$link_clickable
			);
		}
		$links[] = "<li class='hide-on-mobile'>{$post->post_title}</li>";
		echo '<ul>';
		echo implode( '', $links );
		echo '</ul>';
		return ob_get_clean();
	}
}

if ( ! function_exists( 'show_breadcrumb' ) ) {
	function show_breadcrumb($name, $type, $show_parent = false){
		$list = "";
		$home = get_bloginfo("home");

			print_r($q);
		if ($type && $name){
			$ans = get_term_by('name', $name, $type);
			$parentID = $ans->parent;

			if ($show_parent) {
				$q = get_queried_object();
				$list = "<li>{$q->name}</li>";
			}

			while ($parentID > 0){
				$parent = get_term_by('id', $parentID, $type);
				$is_clickable = get_field( 'is_clickable', $parent );
				$url = $home."/".$type."/".$parent->slug;
				$link_clickable = $is_clickable ? "<a href='".$url."' rel='tag' class='text-white ". $is_clickable ."'>".$parent->name."</a>" : $parent->name;
				$list = "<li>{$link_clickable}</li>".$list;
				$parentID = $parent->parent;
			}
			$url = $home."/".$type."/".$ans->slug;
			$list = $list."<li class='hide-on-mobile'>".$ans->name."</li>";
		}   
	
		if ($list) echo "<ul>".$list."</ul>";
	}
}

if ( ! function_exists( 'related_programs' ) ) {
	function related_programs( $post, $taxonomy, $limits = 3 ) {
		$custom_taxterms = wp_get_object_terms( $post->ID, $taxonomy, ['fields' => 'ids'] );
		// arguments
		$args = [
			'post_type' => 'programs',
			'post_status' => 'publish',
			'posts_per_page' => $limits,
			'orderby' => 'rand',
			'tax_query' => [
				[
					'taxonomy' => $taxonomy,
					'field' => 'id',
					'terms' => $custom_taxterms
				]
			],
			'post__not_in' => [ $post->ID ],
		];
		$related_items = new WP_Query( $args );
		// loop over query
		if ($related_items->have_posts()) :
			echo '<div class="similar-programs mt-5 mb-5 row">';
			while ( $related_items->have_posts() ) : $related_items->the_post();
			$short_description = wp_trim_words( get_the_content() );
        	$short_description = strlen( $short_description ) > 200 ? substr( $short_description, 0, 200 ) .'...' : $short_description;
			?>
			<div class="col-md-4 col-lg-4 col-sm-12 margin-bottom-mobile">
				<div class="card kesato-card p-4 border-top">
					<div class="card-body">
						<h5 class="card-title"><?php the_title(); ?></h5>
						<p><?= $short_description; ?></p>
					</div>
					<a href="<?php the_permalink(); ?>" class="btn btn-default btn-hover-outline d-block">
						<?= __('See The Programs', 'cestm') ?>
					</a>
				</div>
			</div>
			<?php
			endwhile;
			echo '</div>';
		endif;
		// Reset Post Data
		wp_reset_postdata();
	}
}

if ( ! function_exists('display_institution_dropdown') ) {
	function display_institution_dropdown() {
		$args = array(
			'post_type'      => 'institutions',
			'posts_per_page' => -1,
		);
		$the_query = new WP_Query($args);
		echo "<select id='institution-select' class='form-control custom-select institution-select'>";
		echo "<option value='' selected disabled>Select institutions</option>";
		while ( $the_query->have_posts() ) : $the_query->the_post();
			$id = get_the_ID();
			$title = get_the_title();
			$content = wp_trim_words( get_the_content() );
			?>
				<option value="<?= $id ?>" class='<?= $id ?>' data-title="<?= $title ?>" data-description="<?= $content ?>"><?= $title ?></option>
			<?php
		endwhile;
		echo '</select>';
		echo '<div class="institution-selected-result mt-4"></div>';
		wp_reset_postdata();
	}
}

if ( ! function_exists('get_post_by_taxonomy') ) {
	function get_post_by_taxonomy($terms, $taxonomy) {
		$args = array(
			'post_type' => 'programs',
			'tax_query' => array(
				array(
					'taxonomy' => $taxonomy,
					'field' => 'name',
					'terms' => $terms
				)
			),
		);
		$related = new WP_Query( $args );
		// loop post
		if ( $related->have_posts() ) {
			echo "<select class='form-control custom-select program-selects col-12 w-100'>";
			while ( $related->have_posts() ) : $related->the_post();
				$title = get_the_title();
				$id = get_the_ID();
				$link = get_the_permalink();
			?>
				<option value="<?= $id ?>" data-link="<?= $link ?>"><?= $title ?></option>
			<?php
			endwhile;
			echo "</select>";
			echo '<button class="program-button d-block mt-3 btn btn-default btn-hover-outline pl-5 pr-5 col-12">'. __('See The Programs', 'cestm') .'</button>';
		}
	}
}