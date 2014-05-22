[![Build Status](https://secure.travis-ci.org/chrisnharvey/oauth.png)](http://travis-ci.org/chrisnharvey/oauth)

# OAuth Composer Package

Authorize users with your application using multiple OAuth 1 and OAuth 2 providers.

## Examples

OAuth is split into two sections, clients and providers. A client is an application - perhaps a basic Twitter feed aggregator - which 
authenticates with an OAuth provider, which in this example would be Twitter itself. You can interact with any provider which is supported in the list below:

- Appnet
- Dropbox
- Facebook
- Flickr
- Foursquare
- GitHub
- Google
- Instagram
- LinkedIn
- Mailchimp
- Mailru
- PayPal
- Soundcloud
- Tumblr
- Twitter
- Vimeo
- Vkontakte
- Windows Live
- Yandex
- YouTube

## Usage Example

In this example we will authenticate the user using Twitter.

```php
$provider = \OAuth\OAuth::provider('Twitter', array(
	'id' => 'CLIENT_ID',
	'secret' => 'CLIENT_SECRET',
	'redirect_url' => 'URL_TO_THIS_PAGE'
));

$oauth = $provider->process(function($url, $token = null) {

    if ($token) {
        session_start();
        $_SESSION['token'] = base64_encode(serialize($token));
    }

    header("Location: {$url}");
    exit;

}, function() {

    session_start();
    return unserialize(base64_decode($_SESSION['token']));

});

print_r($oauth->getUserInfo());
```

If all goes well you should see a dump of user data.

Contribute
----------

1. Check for open issues or open a new issue for a feature request or a bug
2. Fork [the repository][] on Github to start making your changes to the
    `develop` branch (or branch off of it)
3. Write a test which shows that the bug was fixed or that the feature works as expected
4. Send a pull request and bug me until I merge it

[the repository]: https://github.com/chrisnharvey/oauth
