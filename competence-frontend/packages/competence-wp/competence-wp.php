<?php
/**
 * Plugin Name:       Competence Wp
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       competence-wp
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_action( 'enqueue_block_assets', 'competence_wp_enqueue_react_scripts' );
function competence_wp_enqueue_react_scripts() {
	wp_enqueue_script( 'react', 'https://unpkg.com/react@18/umd/react.production.min.js', [], null, true );
	wp_enqueue_script( 'react-dom', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', [ 'react' ], null, true );
}

/**
 * Registers the block using a `blocks-manifest.php` file, which improves the performance of block type registration.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 *
 * WE JUST AIM WORDPRESS 6.8 ..so just 6.8 is tested, code exist in fallback
 */



function create_block_competence_wp_block_init() {
	// ✅ Register all blocks using the generated manifest
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection(
			__DIR__ . '/',
			__DIR__ . '/blocks-manifest.php'
		);
		return;
	}

	// 🔁 Fallback for WordPress < 6.8
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection(
			__DIR__ . '/',
			__DIR__ . '/blocks-manifest.php'
		);
	}

	// 🧱 Fallback if even that doesn’t work — manually register each block
	if ( file_exists( __DIR__ . '/blocks-manifest.php' ) ) {
		$manifest = require __DIR__ . '/blocks-manifest.php';
		foreach ( array_keys( $manifest ) as $block_dir ) {
			register_block_type( __DIR__ . "/$block_dir" );
		}
	}

	register_block_type( __DIR__ . '/login-form' );  //temporary for test
}
add_action( 'init', 'create_block_competence_wp_block_init' );


/* CREATION OF PAGE I NEED FOR REDIRECTION SLUGS, all page used for routing in competence slugion ae created there */
register_activation_hook(__FILE__, 'competence_wp_create_pages');

function competence_wp_create_pages() {
    $pages = [
        [
            'title' => 'Login',
            'slug'  => 'competence_login',
            'block' => '<!-- wp:competence-wp/block-login /-->',
        ],
        [
            'title' => 'Dashboard',
            'slug'  => 'competence_dashboard',
            'block' => '<!-- wp:competence-wp/block-eleve /-->',
        ],
        [
            'title' => 'Home',
            'slug'  => 'competence_home',
            'block' => '<!-- wp:paragraph -->Welcome to Competence Home<!-- /wp:paragraph -->',
        ],
        [
            'title' => 'Error',
            'slug'  => 'competence_error',
            'block' => '<!-- wp:paragraph -->An error occurred.<!-- /wp:paragraph -->',
        ]
    ];

    foreach ($pages as $page) {
        if (!get_page_by_path($page['slug'])) {
            wp_insert_post([
                'post_title'   => $page['title'],
                'post_name'    => $page['slug'],
                'post_content' => $page['block'],
                'post_status'  => 'publish',
                'post_type'    => 'page',
            ]);
        }
    }
}


/* CREATION ADMIN PAGE TO MANAGE DATA */
// Inject JS variable
add_action('wp_enqueue_scripts', 'competence_wp_localize_script');
function competence_wp_localize_script() {
    $api_url = get_option('competence_api_url', 'http://localhost:8000/api');

    wp_localize_script(
        'competence-wp-block-login-view',
        'COMPETENCE_ENV',
        [ 'API_URL' => $api_url ]
    );
}

// Create the admin menu item
add_action('admin_menu', 'competence_wp_add_settings_page');
function competence_wp_add_settings_page() {
    add_options_page(
        'Competence Plugin Settings',
        'Competence Settings',
        'manage_options',
        'competence-wp-settings',
        'competence_wp_render_settings_page'
    );
}

// Render the settings page HTML
function competence_wp_render_settings_page() {
    ?>
    <div class="wrap">
        <h1>Competence Plugin Settings</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('competence_wp_settings');
            do_settings_sections('competence-wp-settings');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

// Register the settings field
add_action('admin_init', 'competence_wp_register_settings');
function competence_wp_register_settings() {
    register_setting('competence_wp_settings', 'competence_api_url');

    add_settings_section(
        'competence_wp_main_section',
        'Main Settings',
        null,
        'competence-wp-settings'
    );

    add_settings_field(
        'competence_api_url',
        'API Base URL',
        'competence_wp_api_url_field_html',
        'competence-wp-settings',
        'competence_wp_main_section'
    );
}

// The HTML input field
function competence_wp_api_url_field_html() {
    $value = esc_attr(get_option('competence_api_url', 'http://localhost:8000/api'));
    echo "<input type='text' name='competence_api_url' value='$value' size='50' />";
}

