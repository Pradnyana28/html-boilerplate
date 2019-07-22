<?php
/**
 * Programs page close.
 *
 * @package understrap
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

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
                    <?php $how_to_register = get_field( 'how_to_register' ) ?>
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