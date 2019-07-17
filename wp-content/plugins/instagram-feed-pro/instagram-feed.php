<?php 
/*
Plugin Name: Instagram Feed Pro Developer
Plugin URI: http://smashballoon.com/instagram-feed
Description: Add a customizable Instagram feed to your website
Version: 4.0.6
Author: Smash Balloon
Author URI: http://smashballoon.com/
*/
/*
Copyright 2018  Smash Balloon  (email: hey@smashballoon.com)
This program is paid software; you may not redistribute it under any
circumstances without the expressed written consent of the plugin author.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

if ( function_exists('display_instagram') ){
    wp_die( "Please deactivate the free version of the Instagram Feed plugin before activating this version.<br /><br />Back to the WordPress <a href='".get_admin_url(null, 'plugins.php')."'>Plugins page</a>." );
} else {
	// include business post handling classes
	require_once( trailingslashit( dirname( __FILE__ ) ) . 'inc/class-sb-instagram-connected-accounts.php' );
	require_once( trailingslashit( dirname( __FILE__ ) ) . 'inc/class-sb-instagram-feed.php' );
	require_once( trailingslashit( dirname( __FILE__ ) ) . 'inc/class-sb-instagram-post.php' );
	require_once( trailingslashit( dirname( __FILE__ ) ) . 'inc/class-sb-instagram-post-set.php' );
	require_once( trailingslashit( dirname( __FILE__ ) ) . 'inc/class-sb-instagram-posts-manager.php' );
	global $sb_instagram_posts_manager;
	$sb_instagram_posts_manager = new SB_Instagram_Posts_Manager();
	include dirname( __FILE__ ) .'/sbi-init.php';
}

// set_site_transient( 'update_plugins', null );
define( 'SBIVER', '4.0.6' );
define( 'SBI_WELCOME_VER', '4_0' ); //Update when the Welcome page has new items to show
define( 'SBI_DBVER', '1.1' );
define( 'SBI_STORE_URL', 'http://smashballoon.com/' );
define( 'SBI_PLUGIN_NAME', 'Instagram Feed Pro Developer' ); //Update #
define( 'SBI_UPLOADS_NAME', 'sb-instagram-feed-images' );
define( 'SBI_INSTAGRAM_POSTS_TYPE', 'sbi_instagram_posts' );
define( 'SBI_INSTAGRAM_FEEDS_POSTS', 'sbi_instagram_feeds_posts' );
define( 'SBI_BACKUP_PREFIX', '!' );
define( 'SBI_FPL_PREFIX', '$' );
define( 'SBI_USE_BACKUP_PREFIX', '&' );
define( 'SBI_POSTS_PER_REQUEST', 33 );

// The ID of the product. Used for renewals
$sbi_download_id = 33751; //33604, 33748, 33751

if( !class_exists( 'EDD_SL_Plugin_Updater' ) ) {
    // load custom updater
    include( dirname( __FILE__ ) . '/EDD_SL_Plugin_Updater.php' );
}

function sb_instagram_plugin_updater() {
    // retrieve license key from the DB
    $sbi_license_key = trim( get_option( 'sbi_license_key' ) );

    // setup the updater
    $edd_updater = new EDD_SL_Plugin_Updater( SBI_STORE_URL, __FILE__, array( 
            'version'   => SBIVER,                   // current version number
            'license'   => $sbi_license_key,        // license key
            'item_name' => SBI_PLUGIN_NAME,         // name of this plugin
            'author'    => 'Smash Balloon'          // author of this plugin
        )
    );
}
add_action( 'admin_init', 'sb_instagram_plugin_updater', 0 );

//Run function on plugin activate
function sb_instagram_activate_pro( $network_wide ) {
    $options = get_option('sb_instagram_settings');
    $license = get_option( 'sbi_license_key' );

    //If all settings are set to be false then set them to be true as this likely means there was an issue with the settings not saving on activation
    if( $options[ 'sb_instagram_show_btn' ] !== true && $options[ 'sb_instagram_show_header' ] !== true && $options[ 'sb_instagram_show_follow_btn' ] !== true && is_null($options['connected_accounts']) && empty($license) ){
        $options[ 'sb_instagram_show_btn' ] = true;
        $options[ 'sb_instagram_show_header' ] = true;
        $options[ 'sb_instagram_show_follow_btn' ] = true;

        update_option( 'sb_instagram_settings', $options );
    }
    
	//Clear page caching plugins and autoptomize
	if ( is_callable( 'sb_instagram_clear_page_caches' ) ) {
		sb_instagram_clear_page_caches();
	}
    //Run cron twice daily when plugin is first activated for new users
    wp_schedule_event(time(), 'twicedaily', 'sb_instagram_cron_job');
	delete_option( 'sb_expired_tokens' );


    if ( is_multisite() && $network_wide && function_exists( 'get_sites' ) && class_exists( 'WP_Site_Query' ) ) {

        // Get all blogs in the network and activate plugin on each one
        $sites = get_sites();
        foreach ( $sites as $site ) {
            switch_to_blog( $site->blog_id );

            $upload = wp_upload_dir();
            $upload_dir = $upload['basedir'];
            $upload_dir = trailingslashit( $upload_dir ) . SBI_UPLOADS_NAME;
            if ( ! file_exists( $upload_dir ) ) {
                $created = wp_mkdir_p( $upload_dir );
                require_once( trailingslashit( dirname( __FILE__ ) ) . 'inc/class-sb-instagram-posts-manager.php' );
                $sb_instagram_posts_manager = new SB_Instagram_Posts_Manager();
                if ( $created ) {
                    $sb_instagram_posts_manager->remove_error( 'upload_dir' );
                } else {
                    $sb_instagram_posts_manager->add_error( 'upload_dir', array( __( 'There was an error creating the folder for storing resized images.', 'instagram-feed' ), $upload_dir ) );
                }
            } else {
                require_once( trailingslashit( dirname( __FILE__ ) ) . 'inc/class-sb-instagram-posts-manager.php' );
                $sb_instagram_posts_manager = new SB_Instagram_Posts_Manager();

                $sb_instagram_posts_manager->remove_error( 'upload_dir' );
            }

            sbi_create_database_table();
            restore_current_blog();
        }

    } else {
        $upload = wp_upload_dir();
        $upload_dir = $upload['basedir'];
        $upload_dir = trailingslashit( $upload_dir ) . SBI_UPLOADS_NAME;
        if ( ! file_exists( $upload_dir ) ) {
            $created = wp_mkdir_p( $upload_dir );
            require_once( trailingslashit( dirname( __FILE__ ) ) . 'inc/class-sb-instagram-posts-manager.php' );
            $sb_instagram_posts_manager = new SB_Instagram_Posts_Manager();
            if ( $created ) {
                $sb_instagram_posts_manager->remove_error( 'upload_dir' );
            } else {
                $sb_instagram_posts_manager->add_error( 'upload_dir', array( __( 'There was an error creating the folder for storing resized images.', 'instagram-feed' ), $upload_dir ) );
            }
        } else {
            require_once( trailingslashit( dirname( __FILE__ ) ) . 'inc/class-sb-instagram-posts-manager.php' );
            $sb_instagram_posts_manager = new SB_Instagram_Posts_Manager();

            $sb_instagram_posts_manager->remove_error( 'upload_dir' );
        }

        sbi_create_database_table();
    }

	//Set transient for welcome page
	set_transient( '_sbi_activation_redirect', true, 30 );
}
register_activation_hook( __FILE__, 'sb_instagram_activate_pro' );

function sbi_on_create_blog( $blog_id, $user_id, $domain, $path, $site_id, $meta ) {
    if ( is_plugin_active_for_network( 'instagram-feed-pro/instagram-feed.php' ) ) {
        switch_to_blog( $blog_id );
        create_table();
        restore_current_blog();
    }
}
add_action( 'wpmu_new_blog', 'sbi_on_create_blog', 10, 6 );

function sbi_create_database_table() {
	global $wpdb;
	global $sb_instagram_posts_manager;

	$charset_collate = $wpdb->get_charset_collate();
	$table_name = esc_sql( $wpdb->prefix . SBI_INSTAGRAM_POSTS_TYPE );

	if ( $wpdb->get_var( "show tables like '$table_name'" ) != $table_name ) {
		$sql = "CREATE TABLE " . $table_name . " (
                id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                created_on DATETIME,
                instagram_id VARCHAR(1000) DEFAULT '' NOT NULL,
                time_stamp DATETIME,
                top_time_stamp DATETIME,
                json_data LONGTEXT DEFAULT '' NOT NULL,
                media_id VARCHAR(1000) DEFAULT '' NOT NULL,
                sizes VARCHAR(1000) DEFAULT '' NOT NULL,
                aspect_ratio DECIMAL (4,2) DEFAULT 0 NOT NULL,
                images_done TINYINT(1) DEFAULT 0 NOT NULL,
                last_requested DATE
            ) $charset_collate;";
		$wpdb->query( $sql );
	}
	$error = $wpdb->last_error;
	$query = $wpdb->last_query;

	if ( $wpdb->get_var( "show tables like '$table_name'" ) != $table_name ) {
		$sb_instagram_posts_manager->add_error( 'database_create_posts', array( __( 'There was an error when trying to create the database tables used for resizing images.', 'instagram-feed' ), $error . '<br><code>' . $query . '</code>' ) );
	} else {
		$sb_instagram_posts_manager->remove_error( 'database_create_posts' );
	}

	$feeds_posts_table_name = esc_sql( $wpdb->prefix . SBI_INSTAGRAM_FEEDS_POSTS );

	if ( $wpdb->get_var( "show tables like '$feeds_posts_table_name'" ) != $feeds_posts_table_name ) {
		$sql = "CREATE TABLE " . $feeds_posts_table_name . " (
				record_id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                id INT(11) UNSIGNED NOT NULL,
                instagram_id VARCHAR(1000) DEFAULT '' NOT NULL,
                feed_id VARCHAR(1000) DEFAULT '' NOT NULL,
                INDEX feed_id (feed_id(100))
            ) $charset_collate;";
		$wpdb->query( $sql );
	}
	$error = $wpdb->last_error;
	$query = $wpdb->last_query;

	if ( $wpdb->get_var( "show tables like '$feeds_posts_table_name'" ) != $feeds_posts_table_name ) {
		$sb_instagram_posts_manager->add_error( 'database_create_posts_feeds', array( __( 'There was an error when trying to create the database tables used for resizing images.', 'instagram-feed' ), $error . '<br><code>' . $query . '</code>' ) );
	} else {
		$sb_instagram_posts_manager->remove_error( 'database_create_posts_feeds' );
	}

}

function sbi_check_for_db_updates() {

	$db_ver = get_option( 'sbi_db_version', 0 );

	if ( (int)$db_ver < 1 ) {

		sbi_create_database_table();
		update_option( 'sbi_db_version', SBI_DBVER );
	}

    if ( (int)$db_ver < 1.1 ) {

        $upload = wp_upload_dir();
        $upload_dir = $upload['basedir'];
        $upload_dir = trailingslashit( $upload_dir ) . SBI_UPLOADS_NAME;
        if ( ! file_exists( $upload_dir ) ) {
            $created = wp_mkdir_p( $upload_dir );
            require_once( trailingslashit( dirname( __FILE__ ) ) . 'inc/class-sb-instagram-posts-manager.php' );
            $sb_instagram_posts_manager = new SB_Instagram_Posts_Manager();
            if ( $created ) {
                $sb_instagram_posts_manager->remove_error( 'upload_dir' );
            } else {
                $sb_instagram_posts_manager->add_error( 'upload_dir', array( __( 'There was an error creating the folder for storing resized images.', 'instagram-feed' ), $upload_dir ) );
            }
        } else {
            require_once( trailingslashit( dirname( __FILE__ ) ) . 'inc/class-sb-instagram-posts-manager.php' );
            $sb_instagram_posts_manager = new SB_Instagram_Posts_Manager();

            $sb_instagram_posts_manager->remove_error( 'upload_dir' );
        }
        update_option( 'sbi_db_version', SBI_DBVER );
    }

}
add_action( 'wp_loaded', 'sbi_check_for_db_updates' );

function sb_instagram_deactivate_pro() {
    wp_clear_scheduled_hook('sb_instagram_cron_job');
}
register_deactivation_hook(__FILE__, 'sb_instagram_deactivate_pro');

//Uninstall
function sb_instagram_uninstall_pro()
{
    if ( ! current_user_can( 'activate_plugins' ) )
        return;

    //If the user is preserving the settings then don't delete them
    $options = get_option('sb_instagram_settings');
    $sb_instagram_preserve_settings = $options[ 'sb_instagram_preserve_settings' ];
    if($sb_instagram_preserve_settings) return;

    //Settings
    delete_option( 'sb_instagram_settings' );
	delete_option( 'sb_instagram_white_list_names' );
	delete_option( 'sb_instagram_using_custom_sizes' );
	delete_transient( 'sbinst_comment_cache' );
	delete_option( 'sbi_ver' );
	delete_option( 'sb_instagram_white_list_names' );
	delete_option( 'sb_permanent_white_lists' );
	delete_option( 'sb_expired_tokens' );

	//Deactivate and delete license
    // retrieve the license from the database
    $license = trim( get_option( 'sbi_license_key' ) );
    // data to send in our API request
    $api_params = array( 
        'edd_action'=> 'deactivate_license', 
        'license'   => $license, 
        'item_name' => urlencode( SBI_PLUGIN_NAME ) // the name of our product in EDD
    );
    // Call the custom API.
    $response = wp_remote_get( add_query_arg( $api_params, SBI_STORE_URL ), array( 'timeout' => 15, 'sslverify' => false ) );
    delete_option( 'sbi_license_key' );
    delete_option( 'sbi_license_status' );

	// Clear backup caches
	global $wpdb;
	$table_name = $wpdb->prefix . "options";
	$wpdb->query( "
        DELETE
        FROM $table_name
        WHERE `option_name` LIKE ('%!sbi\_%')
        " );
	$wpdb->query( "
        DELETE
        FROM $table_name
        WHERE `option_name` LIKE ('%\_transient\_&sbi\_%')
        " );
	$wpdb->query( "
        DELETE
        FROM $table_name
        WHERE `option_name` LIKE ('%\_transient\_timeout\_&sbi\_%')
        " );
	$wpdb->query("
    DELETE
    FROM $table_name
    WHERE `option_name` LIKE ('%sb_instagram_white_lists_%')
    ");
	$wpdb->query("
    DELETE
    FROM $table_name
    WHERE `option_name` LIKE ('%sb_wlupdated_%')
    ");

	//image resizing
	$upload = wp_upload_dir();
	$posts_table_name = $wpdb->prefix . 'sbi_instagram_posts';
	$feeds_posts_table_name = esc_sql( $wpdb->prefix . 'sbi_instagram_feeds_posts' );

	$image_files = glob( trailingslashit( $upload['basedir'] ) . trailingslashit( 'sb-instagram-feed-images' ) . '*'  ); // get all file names
	foreach ( $image_files as $file ) { // iterate files
		if ( is_file( $file ) ) {
			unlink( $file );
		} // delete file
	}
	//Delete tables
	$wpdb->query( "DROP TABLE IF EXISTS $posts_table_name" );
	$wpdb->query( "DROP TABLE IF EXISTS $feeds_posts_table_name" );

	$table_name = $wpdb->prefix . "options";
	$wpdb->query( "
			        DELETE
			        FROM $table_name
			        WHERE `option_name` LIKE ('%\_transient\_\$sbi\_%')
			        " );
	$wpdb->query( "
			        DELETE
			        FROM $table_name
			        WHERE `option_name` LIKE ('%\_transient\_timeout\_\$sbi\_%')
			        " );
	delete_option( 'sbi_hashtag_ids' );
	delete_option( 'sb_instagram_errors' );

}
register_uninstall_hook( __FILE__, 'sb_instagram_uninstall_pro' );

function sbi_on_delete_blog( $tables ) {
    $options = get_option('sb_instagram_settings');
    $sb_instagram_preserve_settings = $options[ 'sb_instagram_preserve_settings' ];
    if($sb_instagram_preserve_settings) return;

    global $wpdb;
    $tables[] = $wpdb->prefix . 'table_name';
    return $tables;
}
add_filter( 'wpmu_drop_tables', 'sbi_on_delete_blog' );