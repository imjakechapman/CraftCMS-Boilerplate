<?php
namespace Craft;

/**
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2014, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license Craft License Agreement
 * @link      http://buildwithcraft.com
 */

/**
 * DbCache implements a cache application component by storing cached data in a database.
 *
 * DbCache stores cache data in a DB table named {@link cacheTableName}.
 * If the table does not exist, it will be automatically created.
 *
 * DbCache relies on {@link http://www.php.net/manual/en/ref.pdo.php PDO} to access database.
 * By default, it will use the database connection information stored in your craft/config/db.php file.
 */
class DbCache extends \CDbCache
{
	/**
	 * @return DbConnection
	 */
	public function getDbConnection()
	{
		return craft()->db;
	}
}
