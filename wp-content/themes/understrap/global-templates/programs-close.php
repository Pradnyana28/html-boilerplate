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
        <div class="cestm-collapse">
            <a class="d-block" data-toggle="collapse" href="#whoIsItFor" role="button" aria-expanded="false" aria-controls="whoIsItFor">
                Who is It For
            </a>
            <div class="collapse" id="whoIsItFor">
                <div class="p-5">
                    <?php the_field( 'who_is_it_for' ) ?>
                </div>
            </div>
        </div>
    </div>
</div>