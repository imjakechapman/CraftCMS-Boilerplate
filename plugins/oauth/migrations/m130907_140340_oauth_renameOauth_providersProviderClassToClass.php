<?php

/**
 * Craft OAuth by Dukt
 *
 * @package   Craft OAuth
 * @author    Benjamin David
 * @copyright Copyright (c) 2014, Dukt
 * @license   https://dukt.net/craft/oauth/docs/license
 * @link      https://dukt.net/craft/oauth/
 */

namespace Craft;

/**
 * The class name is the UTC timestamp in the format of mYYMMDD_HHMMSS_pluginHandle_migrationName
 */
class m130907_140340_oauth_renameOauth_providersProviderClassToClass extends BaseMigration
{
	/**
	 * Any migration code in here is wrapped inside of a transaction.
	 *
	 * @return bool
	 */
	public function safeUp()
	{
		$providersTable = $this->dbConnection->schema->getTable('{{oauth_providers}}');

		if ($providersTable)
		{
			if($this->renameColumn('{{oauth_providers}}', 'providerClass', 'class')) {
				Craft::log('Renamed `{{oauth_providers}}`.`providerClass` to `{{oauth_providers}}`.`class`.', LogLevel::Info, true);
			} else {
				Craft::log('Couldn\'t rename `{{oauth_providers}}`.`providerClass` to `{{oauth_providers}}`.`class`.', LogLevel::Warning);
			}
		}
		else
		{
			Craft::log('Could not find an `{{oauth_providers}}` table. Wut?', LogLevel::Error);
		}

		return true;
	}
}
