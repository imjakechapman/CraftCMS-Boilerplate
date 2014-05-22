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

namespace OAuthProviderSources;

class FlickrOAuthProviderSource extends BaseOAuthProviderSource {

	public $consoleUrl = 'http://www.flickr.com/services/apps/';

	public function getName()
	{
		return 'Flickr';
	}
}