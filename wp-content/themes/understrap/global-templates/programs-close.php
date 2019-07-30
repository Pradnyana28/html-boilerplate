<?php
/**
 * Programs page close.
 *
 * @package understrap
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$discovers = get_field( 'discover_section', 'option' );
?> 
    </div>

    <div class="programs-benefit">
        <!-- Who is it for -->
        <div id="accordion" class="cestm-collapse">
            <div class="p-4 collapse-item">
                <a class="collapse-button d-block" data-parent="#accordion" data-toggle="collapse" href="#whoIsItFor" role="button" aria-expanded="false" aria-controls="whoIsItFor">
                    Who is It For
                </a>
                <div class="collapse collapse-content" id="whoIsItFor">
                    <?php the_field( 'who_is_it_for' ) ?>
                </div>
            </div>

            <div class="p-4 collapse-item">
                <a class="collapse-button d-block" data-parent="#accordion" data-toggle="collapse" href="#whatYouWillLearn" role="button" aria-expanded="false" aria-controls="whatYouWillLearn">
                    What You Will Learn
                </a>
                <div class="collapse collapse-content" id="whatYouWillLearn">
                    <?php the_field( 'what_you_will_learn' ) ?>
                </div>
            </div>

            <div class="p-4 collapse-item">
                <a class="collapse-button d-block" data-parent="#accordion" data-toggle="collapse" href="#employmentProspects" role="button" aria-expanded="false" aria-controls="employmentProspects">
                    Employment Prospects
                </a>
                <div class="collapse collapse-content" id="employmentProspects">
                    <?php the_field( 'employment_prospects' ) ?>
                </div>
            </div>

            <div class="p-4 collapse-item">
                <a class="collapse-button d-block" data-parent="#accordion" data-toggle="collapse" href="#costsAndConditions" role="button" aria-expanded="false" aria-controls="costsAndConditions">
                    Costs and Conditions of Admissions
                </a>
                <div class="collapse collapse-content" id="costsAndConditions">
                    <?php the_field( 'costs_and_conditions' ) ?>
                </div>
            </div>

            <div class="p-4 collapse-item">
                <a class="collapse-button d-block" data-parent="#accordion" data-toggle="collapse" href="#durationAndDates" role="button" aria-expanded="false" aria-controls="durationAndDates">
                    Duration and Dates of Registration
                </a>
                <div class="collapse collapse-content" id="durationAndDates">
                    <?php the_field( 'duration_and_dates' ) ?>
                </div>
            </div>

            <div class="p-4 collapse-item">
                <a class="collapse-button d-block" data-parent="#accordion" data-toggle="collapse" href="#howToRegister" role="button" aria-expanded="false" aria-controls="howToRegister">
                    How To Register
                </a>
                <div class="collapse collapse-content" id="howToRegister">
                    <?php $how_to_register = get_field( 'how_to_register', 'option' ) ?>
                    <?php $no = 0 ?>
                    <?php foreach ($how_to_register as $guide => $data): ?>
                        <?php $no++ ?>
                        <?php if ($data['title']): ?>
                        <div class="register-wrapper">
                            <h5 class="guide-title"><span class="guide-no"><?= $no ?></span> <?= $data['title'] ?></h5>
                            <p class="guide-description"><?= $data['description'] ?></p>
                            <?php if ( !empty( $data['button_link'] ) ): ?>
                                <a href="<?= $data['button_link'] ?>" class="btn pl-5 pr-5 btn-default btn-hover-outline"><?= $data['button_text'] ?></a>
                            <?php endif; ?>

                            <?php if ( !empty( $data['additional_button_link'] ) ): ?>
                                <span class="mr-3 ml-3">or</span>
                                <a href="<?= $data['additional_button_link'] ?>" class="btn pl-5 pr-5 btn-default-outline"><?= $data['additional_button_text'] ?></a>
                            <?php endif; ?>

                            <?php if ( $data['show_institutions'] ): ?>
                                <!-- Institution dropdown -->
                                <?= display_institution_dropdown() ?>
                                <?= cestm_add_marker_loop() ?>
                            <?php endif; ?>
                        </div>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
    </div> <!-- End of overflow-hidden -->
</div>

<div class="col-md no-pl-on-desktop no-pr-on-desktop">
<!-- Similar Programs -->
<div class="similar-programs mt-5 pt-3 pb-5">
    <h3 class="text-uppercase text-center">Programmes D'etudes Similaires</h3>
    <?= related_programs( $post, 'departments' ) ?>
</div>

<!-- Discover Section -->
<div class="discover-wrapper mt-5 no-mt-on-mobile">
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