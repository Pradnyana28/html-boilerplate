<?php
// Don't load directly
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

class SB_Instagram_Connected_Accounts
{
	private $connected_accounts;

	private $hashtag_ids;

	private $business_accounts = array();

	private $personal_accounts = array();

	private $feed_accounts = array();

	private $account_related_feed_settings;

	private $shortcode_atts_raw;

	private $personal_access_tokens;

	private $settings_errors;

	public function __construct( $connected_accounts ) {
		$this->connected_accounts = $connected_accounts;

		$this->hashtag_ids = get_option( 'sbi_hashtag_ids', array() );
	}

	public function add_business_account( $account ) {
		if ( ! isset( $this->business_accounts[ $account['user_id'] ] ) ) {
			$this->business_accounts[ $account['user_id'] ] = $account;
		}
	}

	public function add_personal_account( $account ) {
		if ( ! isset( $this->personal_accounts[ $account['user_id'] ] ) ) {
			$this->personal_accounts[ $account['user_id'] ] = $account;
		}
	}

	public function add_feed_account( $account ) {
		if ( ! isset( $this->feed_accounts[ $account['user_id'] ] ) ) {
			$this->feed_accounts[ $account['user_id'] ] = $account;
		}
	}

	public function set_feed_type_and_terms( $sb_instagram_type = 'user', $sb_instagram_users = array(), $sb_instagram_hashtags = array(), $shortcode_atts_raw, $order ) {

		$order = ! empty( $order ) && $order === 'recent' ? 'recent' : 'top';

		$this->account_related_feed_settings = array(
			'type' => $sb_instagram_type,
			'order' => $order,
			'users' => array(),
			'hashtags' => $sb_instagram_hashtags,
			'hashtags_hashtag_ids' => array(),
			'access_tokens' => array()
		);

		if ( $sb_instagram_type === 'user' && ! empty( $sb_instagram_users ) ) {
			$sb_instagram_users = ! is_array( $sb_instagram_users ) ? explode( ',', $sb_instagram_users ) : $sb_instagram_users;
			foreach ( $sb_instagram_users as $user ) {

				if ( isset( $this->connected_accounts[ $user ] ) ) {
					$type = isset( $this->connected_accounts[ $user ]['type'] ) ? $this->connected_accounts[ $user ]['type'] : 'personal';

					if ( $type === 'business' ) {
						$this->account_related_feed_settings['users'][] = $this->connected_accounts[ $user ]['username'];
					} else {
						$this->account_related_feed_settings['users'][] = $this->connected_accounts[ $user ]['user_id'];
					}

				} else {
					$this->account_related_feed_settings['users'][] = $user;
				}

			}

		}


		if ( $sb_instagram_type === 'user' && empty( $this->account_related_feed_settings['users'] ) ) {
			$this->add_settings_error( 'feed_term', array( 'Please enter a Username on the Instagram plugin Settings page' ) );
		}

		if ( $sb_instagram_type === 'hashtag' && empty( $this->account_related_feed_settings['hashtags'] ) ) {
			$this->add_settings_error( 'feed_term', array( 'Please enter a Hashtag on the Instagram plugin Settings page', '' ) );
		}

		$this->shortcode_atts_raw = $shortcode_atts_raw;
	}

	public function set_access_tokens_and_connected_accounts_for_feed() {

		if ( $this->account_related_feed_settings['type'] === 'user' ) {

			if ( isset( $this->shortcode_atts_raw['accesstoken'] ) ) {

				$shortcode_access_tokens = explode( ',', str_replace( ' ' , '', $this->shortcode_atts_raw['accesstoken'] ) );

				foreach ( $shortcode_access_tokens as $shortcode_access_token ) {
					$number_dots = substr_count ( $shortcode_access_token , '.' );

					if ( $number_dots > 1 ) {
						$split_token = explode( '.', sbi_get_parts( $shortcode_access_token ) );

						$this->account_related_feed_settings['users'][] = $split_token[0];
						$this->account_related_feed_settings['access_tokens'][] = sbi_get_parts( $shortcode_access_token );
					} else {
						$this->add_settings_error( 'access_token', array( 'This access token does no appear to be from a valid personal Instagram account', '' ) );
					}
				}


			} else {
				foreach ( $this->connected_accounts as $connected_account) {
					$type = isset( $connected_account['type'] ) ? $connected_account['type'] : 'personal';

					if ( $type === 'business' ) {
						$this->add_business_account( $connected_account );

						if ( in_array( $connected_account['username'], $this->account_related_feed_settings['users'], true ) || in_array( $connected_account['user_id'], $this->account_related_feed_settings['users'], true ) ) {
							$this->add_feed_account( $connected_account );
							$this->account_related_feed_settings['access_tokens'][] = $this->get_formatted_business_token( $connected_account['user_id'], $connected_account['username'] );
						}

					} else {

						$this->add_personal_account( $connected_account );

						if ( in_array( $connected_account['username'], $this->account_related_feed_settings['users'], true ) || in_array( $connected_account['user_id'], $this->account_related_feed_settings['users'], true ) ) {
							$this->add_feed_account( $connected_account );
							$this->account_related_feed_settings['access_tokens'][] = $connected_account['access_token'];
						}
					}

				}
			}

			if ( empty( $this->account_related_feed_settings['access_tokens'] ) ) {
				$this->add_settings_error( 'connected_accounts', array( 'There is no connected account for this username', '' ) );
			}

		} elseif ( $this->account_related_feed_settings['type'] === 'hashtag' ) {

			foreach ( $this->connected_accounts as $connected_account) {
				$type = isset( $connected_account['type'] ) ? $connected_account['type'] : 'personal';

				if ( $type === 'business' ) {

					if ( empty( $this->account_related_feed_settings[ 'access_tokens' ] ) ) {
						$this->account_related_feed_settings[ 'access_tokens' ][] = $this->get_formatted_business_token( $connected_account['user_id'], $connected_account['username'] );
					}

					$this->add_business_account( $connected_account );
					$this->add_feed_account( $connected_account );

				} else {
					$this->add_personal_account( $connected_account );

				}


			}

			foreach ( $this->account_related_feed_settings['hashtags'] as $hashtag ) {

				if ( isset( $this->hashtag_ids[ $hashtag ] ) ) {
					$this->account_related_feed_settings['hashtags_hashtag_ids'][] = trim( $hashtag ) . '||' . $this->hashtag_ids[ $hashtag ];
				} else {
					$this->account_related_feed_settings['hashtags_hashtag_ids'][] = trim( $hashtag );
				}

			}

			if ( empty( $this->business_accounts ) ) {
			    $this->add_settings_error( 'connected_accounts', array( 'Please connect a business account on the Instagram Feed settings page in order to display hashtag feeds', 'Please see <a href=\'https://smashballoon.com/instagram-api-changes-dec-11-2018/\' target=\'_blank\'>this post</a> for more information.' ) );
			}

		} elseif ( $this->account_related_feed_settings['type'] === 'mixed' ) {

			if ( isset( $this->shortcode_atts_raw['accesstoken'] ) ) {

				$shortcode_access_tokens = explode( ',', str_replace( ' ' , '', $this->shortcode_atts_raw['accesstoken'] ) );

				foreach ( $shortcode_access_tokens as $shortcode_access_token ) {
					$number_dots = substr_count ( $shortcode_access_token , '.' );

					if ( $number_dots > 1 ) {
						$split_token = explode( '.', sbi_get_parts( $shortcode_access_token ) );

						$this->account_related_feed_settings['users'][] = $split_token[0];
						$this->account_related_feed_settings['access_tokens'][] = sbi_get_parts( $shortcode_access_token );
					} else {
						$this->add_settings_error( 'access_token', array( 'This access token does no appear to be from a valid personal Instagram account', '' ) );
					}
				}

			}

			$users = isset( $this->shortcode_atts_raw['user'] ) ? explode(',', str_replace(' ', '', $this->shortcode_atts_raw['user'] ) ) : array();
			$hashtags = isset( $this->shortcode_atts_raw['hashtag'] ) ? explode(',', str_replace(' ', '', $this->shortcode_atts_raw['hashtag'] ) ) : array();

			foreach ( $users as $user ) {
				foreach ( $this->connected_accounts as $connected_account ) {
					$type = isset( $connected_account['type'] ) ? $connected_account['type'] : 'personal';


					if ( isset( $connected_account['username'] ) && strtolower( $connected_account['username'] ) === strtolower( $user ) && ! in_array( strtolower( $user ), $this->account_related_feed_settings['users'], true ) ) {
						if ( $type === 'business' ) {
							$this->add_business_account( $connected_account );
							$this->add_feed_account( $connected_account );
							$this->account_related_feed_settings['users'][] = $connected_account['username'];
							if ( in_array( $connected_account['username'], $this->account_related_feed_settings['users'], true ) ) {
								$this->account_related_feed_settings[ 'access_tokens' ][] = $this->get_formatted_business_token( $connected_account['user_id'], $connected_account['username'] );
							}
						} else {
							$this->add_personal_account( $connected_account );
							$this->account_related_feed_settings['users'][] = $connected_account['user_id'];
							$this->account_related_feed_settings['access_tokens'][] = $connected_account['access_token'];
						}

					} else {
						if ( $type === 'personal' && strtolower( $connected_account['username'] ) === strtolower( $user ) && ! in_array( strtolower( $user ), $this->account_related_feed_settings['users'], true ) ) {

							$this->add_personal_account( $connected_account );

							$this->add_feed_account( $connected_account );
							$this->account_related_feed_settings['access_tokens'][] = $connected_account['access_token'];
							$this->account_related_feed_settings['users'][] = $connected_account['user_id'];
						}
					}

				}
			}

			foreach ( $hashtags as $hashtag ) {

				if ( isset( $this->hashtag_ids[ $hashtag ] ) ) {
					$this->account_related_feed_settings['hashtags_hashtag_ids'][] = trim( $hashtag ) . '||' . $this->hashtag_ids[ $hashtag ];
				} else {
					$this->account_related_feed_settings['hashtags_hashtag_ids'][] = trim( $hashtag );
				}

			}

			if ( empty( $this->business_accounts ) ) {

				foreach ( $this->connected_accounts as $connected_account ) {
					$type = isset( $connected_account['type'] ) ? $connected_account['type'] : 'personal';

					if ( $type === 'business' ) {
						$this->account_related_feed_settings['access_tokens'][] = $this->get_formatted_business_token( $connected_account['user_id'], $connected_account['username'] );
						$this->add_business_account( $connected_account );
					}

				}

				if ( empty( $this->business_accounts ) && ! empty( $hashtags ) ) {
					$this->add_settings_error( 'connected_accounts', array( 'Please connect a business account on the Instagram Feed settings page in order to display hashtag feeds', '' ) );
				}

			}

		} elseif ( $this->account_related_feed_settings['type'] === 'single' ) {
			$singles_users = array();
			if ( ! empty( $this->shortcode_atts_raw['single'] ) ) {
				$singles_array = explode( ',', str_replace( array( 'sbi_', ' ' ), '', $this->shortcode_atts_raw['single'] ) );
				foreach ( $singles_array as $single ) {
					$split = explode('_', $single );
					$singles_users[] = isset( $split[1] ) ? $split[1] : '';
				}
			}

			if ( isset( $this->shortcode_atts_raw['accesstoken'] ) ) {

				$shortcode_access_tokens = explode( ',', str_replace( ' ' , '', $this->shortcode_atts_raw['accesstoken'] ) );

				foreach ( $shortcode_access_tokens as $shortcode_access_token ) {
					$number_dots = substr_count ( $shortcode_access_token , '.' );

					if ( $number_dots > 1 ) {
						$split_token = explode( '.', sbi_get_parts( $shortcode_access_token ) );

						$this->account_related_feed_settings['users'][] = $split_token[0];
						$this->account_related_feed_settings['access_tokens'][] = sbi_get_parts( $shortcode_access_token );
					} else {
						$this->add_settings_error( 'access_token', array( 'This access token does no appear to be from a valid personal Instagram account', '' ) );
					}
				}


			} else {
				foreach ( $this->connected_accounts as $connected_account) {

					if ( in_array( $connected_account['user_id'], $singles_users ) ) {

						$this->add_personal_account( $connected_account );

						$this->add_feed_account( $connected_account );
						$this->account_related_feed_settings['access_tokens'][] = $connected_account['access_token'];
					}

				}
			}

		} elseif ( $this->account_related_feed_settings['type'] === 'coordinates' || $this->account_related_feed_settings['type'] === 'location' ) {

			if ( isset( $this->shortcode_atts_raw['accesstoken'] ) ) {

				$shortcode_access_tokens = explode( ',', str_replace( ' ' , '', $this->shortcode_atts_raw['accesstoken'] ) );

				foreach ( $shortcode_access_tokens as $shortcode_access_token ) {
					$number_dots = substr_count ( $shortcode_access_token , '.' );

					if ( $number_dots > 1 ) {
						$split_token = explode( '.', sbi_get_parts( $shortcode_access_token ) );

						$this->account_related_feed_settings['users'][] = $split_token[0];
						$this->account_related_feed_settings['access_tokens'][] = sbi_get_parts( $shortcode_access_token );
					} else {
						$this->add_settings_error( 'access_token', array( 'This access token does no appear to be from a valid personal Instagram account', '' ) );
					}
				}


			} else {
				foreach ( $this->connected_accounts as $connected_account) {
					$type = isset( $connected_account['type'] ) ? $connected_account['type'] : 'personal';

					if ( $type === 'personal' ) {

						$this->add_personal_account( $connected_account );

						$this->add_feed_account( $connected_account );
						$this->account_related_feed_settings['access_tokens'][] = $connected_account['access_token'];
					}

				}
			}

		}

	}

	public function get_account_related_feed_settings() {
		return $this->account_related_feed_settings;
	}

	public function add_settings_error( $type, $message_array ) {
		$this->settings_errors[ $type ] = $message_array;
	}

	public function has_settings_errors() {
		return ! empty( $this->settings_errors );
	}

	public function the_settings_errors( $echo = true ) {
		$html = '<div id="sbi_mod_error" class="sbi_settings_errors">';
		$html .= '<b>This message is only visible to admins</b>';

		foreach ( $this->settings_errors as $key => $error ) {
			$html .= '<p class="sbi_'.$key.'">';

			if ( ! empty ( $error[0] ) ) {
				$html .= $error[0];
			}

			if ( ! empty ( $error[1] ) ) {
				$html .= '<br>' . $error[1];
			}

			$html .= '</p>';
		}

		$html .= '</div>';

		if ( $echo ) {
			echo $html;
		} else {
			return $html;
		}
	}

	private function get_formatted_business_token( $user_id, $user_name ) {
	    return $user_id . '.' . str_replace('.','+', $user_name ) . '.business.account';
    }
}