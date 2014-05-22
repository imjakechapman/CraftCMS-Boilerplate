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

$common = require(CRAFT_APP_PATH.'etc/config/common.php');

return CMap::mergeArray($common, array(

	'basePath' => dirname(__FILE__).'/../../',

	// autoloading model and component classes
	'import' => array(
		'application.*',
		'application.migrations.*',
	),

	'componentAliases' => array(
		'app.*',
		'app.enums.*',
		'app.etc.components.*',
		'app.etc.console.*',
		'app.etc.console.commands.*',
		'app.etc.dates.*',
		'app.etc.db.*',
		'app.etc.db.schemas.*',
		'app.etc.io.*',
		'app.etc.logging.*',
		'app.etc.updates.*',
		'app.helpers.*',
		'app.migrations.*',
		'app.services.*',
		'app.validators.*',
	),

	'components' => array(
		'db' => array(
			'emulatePrepare'    => true,
			'driverMap'         => array('mysql' => 'Craft\MysqlSchema'),
			'class'             => 'Craft\DbConnection',
		),
		'migrations' => array(
			'class'             => 'Craft\MigrationsService',
		),
	),

	'commandPath' => Craft\Craft::getPathOfAlias('system.cli.commands.*'),
));
