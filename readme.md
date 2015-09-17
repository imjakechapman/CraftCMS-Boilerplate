CraftCMS Boilerplate
==============================

**Due to some reasons given by P&T the /craft/app folder has been removed, make sure if you clone this repo to replace that folder from the base craft download**

### Installation
1. First create local database
2. Create db.php and general.php files within /craft/config/local/

```php
    db.php
    // Local database info
    return array(
      'server'    => 'localhost',
      'user'      => 'username',
      'password'  => 'password',
      'database'  => 'local-db-name'
    );

    general.php
    /*
     * Local Config Override
     *
     * Overrides added here will get appended to the end of the
     * custom config array for all environments: '*'
     */
    return array(
      // Give us more useful error messages
      'devMode' => true,

      // Route ALL of the emails that Craft
      // sends to a single email address.
      'testToEmailAddress'  => 'testingemail@example.com',

      'translationDebugOutput'      => false,
      'useCompressedJs'             => true,
      'cacheDuration'               => 'P1D',
      'cooldownDuration'            => 'PT5M',
      'maxInvalidLogins'            => 5,
      'invalidLoginWindowDuration'  => 'PT1H',
      'phpMaxMemoryLimit'           => '256M',

      // Member login info duration
      // http://www.php.net/manual/en/dateinterval.construct.php
      'userSessionDuration'           => 'P101Y',
      'rememberedUserSessionDuration' => 'P101Y',
      'rememberUsernameDuration'      => 'P101Y',
    );
```

Now that you've put the correct database credentials in db.php, head on over to /admin and if all is well will start the installation process


### Gulpjs
If you don't already have Node installed head over to http://nodejs.org/download/
via the command line:

1. Install gulp `npm install -g gulp`
2. Install gulp modules defined in package.json `npm install`
3. Gulp away by running `gulp`

feel free to modify the .scss-lint.yml file to your hearts content on how to lint you scss files.


### .htaccess and .gitignore
The default .htaccess is packed with a bunch of goodies, again feel free to modify to your hearts content. Just make sure to add a period before the file name to make sure its read properly.
The default .gitignore file is setup to track unecessary folders and files, most of it involves not tracking random config files computers will add, as well as node_modules and some stuff within the craft/storage folder
