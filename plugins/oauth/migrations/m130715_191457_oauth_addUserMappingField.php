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
class m130715_191457_oauth_addUserMappingField extends BaseMigration
{
	/**
	 * Any migration code in here is wrapped inside of a transaction.
	 *
	 * @return bool
	 */
	public function safeUp()
	{
		$tokensTable = $this->dbConnection->schema->getTable('{{oauth_tokens}}');

		if ($tokensTable)
		{
			if (($userMappingColumn = $tokensTable->getColumn('userMapping')) == null)
			{
				Craft::log('Adding `userMapping` column to the `oauth_tokens` table.', LogLevel::Info, true);

				$this->addColumnAfter('oauth_tokens', 'userMapping', array(AttributeType::String, 'required' => false), 'userId');

				Craft::log('Added `userMapping` column to the `oauth_tokens` table.', LogLevel::Info, true);
			}
			else
			{
				Craft::log('Tried to add a `userMapping` column to the `oauth_tokens` table, but there is already one there.', LogLevel::Warning);
			}
		}
		else
		{
			Craft::log('Could not find an `oauth_tokens` table. Wut?', LogLevel::Error);
		}

		return true;
	}
}
