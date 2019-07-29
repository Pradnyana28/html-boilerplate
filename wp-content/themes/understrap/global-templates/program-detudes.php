<?php 
    // program data
    $programs = get_field( 'programs', 'options' );
    $fixed_card = get_field( 'fixed_Card', 'options' );
?>
<div class="container mt-5">
    <h2 class="text-uppercase text-bold text-center">Nos Programmes D'etudes</h2>

    <?php
    if ( count( $programs ) > 0 ) {
        echo "<div class='row mt-5'>";
        foreach ($programs as $program) {
            $thumb = $program['image']['url'];
            $program_title = $program['title'];
            $program_link  = $program['link']['url'];
            $short_description = wp_trim_words( $program['content'] );
            $short_description = strlen( $short_description ) > 100 ? substr( $short_description, 0, 100 ) .'...' : $short_description;
            ?>

        <div class="col-md-4 margin-bottom-mobile">
            <div class="card kesato-card">
                <div class="card-image">
                    <img src="<?= $thumb ?>" class="card-img-top" alt="...">
                </div>
                <div class="card-body">
                    <div class="card-slide-up">
                        <h5 class="card-title"><?= $program_title ?></h5>
                        <p class="card-text"><?= $short_description ?></p>
                    </div>
                    <a href="<?= $program_link ?>" class="btn btn-default btn-hover-outline d-block">Go somewhere</a>
                </div>
                <div class="card-hover"></div>
            </div>
        </div>

        <?php } ?>

        <div class="col-md-4 margin-bottom-mobile">
            <div class="card kesato-card card-outline">
                <div class="card-body card-text-only">
                    <h5 class="card-title mt-5"><?= $fixed_card['title'] ?></h5>
                    <p class="card-text"><?= $fixed_card['content'] ?></p>
                    <a href="<?= $fixed_card['link']['url'] ?>" class="btn btn-default btn-hover-outline d-block flex-end"><?= $fixed_card['link']['title'] ?></a>
                </div>
            </div>
        </div>

        <?php echo "</div>"; } ?>
</div>