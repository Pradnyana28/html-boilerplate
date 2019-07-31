<?php

if ( count( $posts ) > 0 ) {
    echo "<div class='row mt-5'>";
    foreach ($posts as $post) {
        $thumb = get_the_post_thumbnail_url( $post );
        $post_title = $post->post_title;
        $post_link  = $post->guid;
        $short_description = wp_trim_words( $post->post_content );
        $short_description = strlen( $short_description ) > 100 ? substr( $short_description, 0, 100 ) .'...' : $short_description;
        ?>

    <div class="col-md-4 margin-bottom-mobile">
        <div class="card kesato-card">
            <div class="card-image">
                <img src="<?= $thumb ?>" class="card-img-top" alt="...">
            </div>
            <div class="card-body">
                <div class="card-slide-up">
                    <h5 class="card-title"><?= $post_title ?></h5>
                    <p class="card-text"><?= $short_description ?></p>
                </div>
                <a href="<?= $post_link ?>" class="btn btn-default btn-hover-outline d-block"><?= __('Learn More', 'cestm') ?></a>
            </div>
            <div class="card-hover"></div>
        </div>
    </div>

    <?php
    }
    echo "</div>";
}