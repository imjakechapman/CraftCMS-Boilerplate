<?php
namespace Craft;

/**
 * The class name is the UTC timestamp in the format of mYYMMDD_HHMMSS_pluginHandle_migrationName
 */
class m130912_153247_oauth_createTokenIndexes extends BaseMigration
{
	/**
	 * Any migration code in here is wrapped inside of a transaction.
	 *
	 * @return bool
	 */

	public function safeUp()
	{
		// unique index for 'userMapping' and 'provider'

		$tableName = 'oauth_tokens';

		$providersTable = $this->dbConnection->schema->getTable('{{'.$tableName.'}}');

		if ($providersTable)
		{
			$columns = 'userMapping, provider';

			$unique = true;

			$this->createIndex($tableName, $columns, $unique);

		}
		else
		{
			Craft::log('Could not find an `'.$tableName.'` table. Wut?', LogLevel::Error);
		}


		// unique index for 'userId' and 'provider'

		$tableName = 'oauth_tokens';

		$providersTable = $this->dbConnection->schema->getTable('{{'.$tableName.'}}');

		if ($providersTable)
		{
			$columns = 'userId, provider';

			$unique = true;

			$this->createIndex($tableName, $columns, $unique);

		}
		else
		{
			Craft::log('Could not find an `'.$tableName.'` table. Wut?', LogLevel::Error);
		}


		// unique index for 'namespace' and 'provider'

		$tableName = 'oauth_tokens';

		$providersTable = $this->dbConnection->schema->getTable('{{'.$tableName.'}}');

		if ($providersTable)
		{
			$columns = 'namespace, provider';

			$unique = true;

			$this->createIndex($tableName, $columns, $unique);

		}
		else
		{
			Craft::log('Could not find an `'.$tableName.'` table. Wut?', LogLevel::Error);
		}

		return true;
	}
}
