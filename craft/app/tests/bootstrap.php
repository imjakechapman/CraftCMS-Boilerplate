<?php

/**
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2014, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license Craft License Agreement
 * @link      http://buildwithcraft.com
 */

// Define path constants
defined('CRAFT_BASE_PATH')         || define('CRAFT_BASE_PATH', str_replace('\\', '/', realpath(dirname(__FILE__).'/../../')).'/');
defined('CRAFT_APP_PATH')          || define('CRAFT_APP_PATH',          CRAFT_BASE_PATH.'app/');
defined('CRAFT_CONFIG_PATH')       || define('CRAFT_CONFIG_PATH',       CRAFT_BASE_PATH.'config/');
defined('CRAFT_PLUGINS_PATH')      || define('CRAFT_PLUGINS_PATH',      CRAFT_BASE_PATH.'plugins/');
defined('CRAFT_STORAGE_PATH')      || define('CRAFT_STORAGE_PATH',      CRAFT_BASE_PATH.'storage/');
defined('CRAFT_TEMPLATES_PATH')    || define('CRAFT_TEMPLATES_PATH',    CRAFT_BASE_PATH.'templates/');
defined('CRAFT_TRANSLATIONS_PATH') || define('CRAFT_TRANSLATIONS_PATH', CRAFT_BASE_PATH.'translations/');
defined('CRAFT_ENVIRONMENT')       || define('CRAFT_ENVIRONMENT',       'craft.dev');

define('YII_ENABLE_EXCEPTION_HANDLER', false);
define('YII_ENABLE_ERROR_HANDLER', false);
define('YII_DEBUG', true);


$_SERVER['DOCUMENT_ROOT']   = '/some/path/to/craft.dev';
$_SERVER['HTTP_HOST']       = 'craft.dev';
$_SERVER['HTTPS']           = 'off';
$_SERVER['PHP_SELF']        = '/index.php';
$_SERVER['REQUEST_URI']     = '/index.php';
$_SERVER['SERVER_PORT']     = 80;
$_SERVER['SCRIPT_FILENAME'] = '/some/path/to/craft.dev/index.php';
$_SERVER['SCRIPT_NAME']     = '/index.php';

function craft_createFolder($path)
{
	// Code borrowed from IOHelper...
	if (!is_dir($path))
	{
		$oldumask = umask(0);

		if (!mkdir($path, 0755, true))
		{
			exit('Tried to create a folder at '.$path.', but could not.');
		}

		// Because setting permission with mkdir is a crapshoot.
		chmod($path, 0755);
		umask($oldumask);
	}
}

function craft_ensureFolderIsReadable($path, $writableToo = false)
{
	$realPath = realpath($path);

	// !@file_exists('/.') is a workaround for the terrible is_executable()
	if ($realPath === false || !is_dir($realPath) || !@file_exists($realPath.'/.'))
	{
		exit (($realPath !== false ? $realPath : $path).' doesn\'t exist or isn\'t writable by PHP. Please fix that.');
	}

	if ($writableToo)
	{
		if (!is_writable($realPath))
		{
			exit ($realPath.' isn\'t writable by PHP. Please fix that.');
		}
	}
}

// Validate permissions on craft/config/ and craft/storage/
craft_ensureFolderIsReadable(CRAFT_CONFIG_PATH);
craft_ensureFolderIsReadable(CRAFT_STORAGE_PATH, true);

// Create the craft/storage/runtime/ folder if it doesn't already exist
craft_createFolder(CRAFT_STORAGE_PATH.'runtime/');
craft_ensureFolderIsReadable(CRAFT_STORAGE_PATH.'runtime/', true);

// change the following paths if necessary
$yiit   = CRAFT_APP_PATH.'framework/yiit.php';
$config = CRAFT_APP_PATH.'etc/config/test.php';

// Load up Yii's test runner.
require_once($yiit);

// Load up Composer's files
require CRAFT_APP_PATH.'vendor/autoload.php';

require_once CRAFT_APP_PATH.'Craft.php';
require_once CRAFT_APP_PATH.'etc/web/WebApp.php';
require_once CRAFT_APP_PATH.'tests/TestApplication.php';

new Craft\TestApplication($config);
