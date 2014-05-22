Stow
====

A plug-in for [Craft CMS](http://buildwithcraft.com/).

With Stow you can cache parts of your webpage for later retrieval. This allows your server to do less processing and your visitors to see your content faster. Everyone is happier with Stow :)

    {% cache {id: 'home-page', global: false} %}
        {% for entry in craft.entries.find() %}
            {{ entry.title }}
        {% endfor %}
    {% endcache %}
    
You must set at least one of the following parameters: `id`, `entry`, `entries`, or `user`. The other parameters are optional.

Parameter                | Type    | Default     | Description
:----------------------- | :------ | :---------- | :------------------------------------------------------
`global`                 | boolean  | true | If set to `true` the cache will be globally accessible, if set to `false` the cache will be dependent on the URL.
`id`                     | string | NULL        | Cached items are tied to their id. If the id is not found in the database then a new cache is created.
`entry` | EntryModel | NULL | An entry that will cause the cache to refresh when it is updated.
`entries` | array | NULL | An array of EntryModels which will cause the cache to refresh when any entry is updated.
`user` | UserModel | NULL | A user that will cause the cache to refresh when it is updated.
`fresh` | boolean | false | The cache tag will essentially be bypassed when set to `true`, allowing you to test changes to the inner content.
`freshAdmin` | boolean | false | Similiar to `fresh`, but will only bypass when the current user is an admin.
`freshUser` | boolean | false | Just like above but any logged-in user will bypass the cache.

Usage
---

Simply wrap the content that you would like to cache as follows:

    {% cache {id: 'my-id'} %}
        this text will be cached until the id changes
    {% endcache %}
    
This simplest way to use Stow is to cache by `id` but as you can see below you may also use `entry`, `entries`, and/or `user`.
    
### Cache-Breaking
    
To cache-break when a particular entry is saved/updated just assign it to the `entry` parameter:

    {% set myEntry = craft.entries.first() %}
    {% cache {entry: myEntry} %}
        this text will stay cached until myEntry is updated
    {% endcache %}
    
For multiple entries at once:

    {% set myEntries = craft.entries.find({section: 'news'}) %}
    {% cache {entries: myEntries} %}
        this text will stay cached until any entry in the 'news' section is updated
    {% endcache %}

Maybe you have a complex user profile and you would like to cache-break based on users, then use the `user` parameter:

    {% set myUser = craft.users.first() %}
    {% cache {user: myUser} %}
        this text will stay cached until myUser is updated
    {% endcache %}
    
### Stay Fresh
    
If you are actively developing the content inside you can bypass the cache without removing the tags by setting `fresh: true`:

    {% cache {id: 'my-id', fresh: true} %}
        this text will never be cached as long as 'fresh' is set to true
    {% endcache %}
    
If you want to keep the content cached for everyone else except admins just use `freshAdmin: true`:

    {% cache {id: 'my-id', freshAdmin: true} %} ... {% endcache %}

Similarly, if you want all logged in users to bypass the cache then use `freshUser: true`:

    {% cache {id: 'my-id', freshUser: true} %} ... {% endcache %}
    
### Nesting
    
Arbitrary nesting is supported, but for your sanity I wouldn't recommend going more than a level or two deep:

    {% cache {id: 'level-1'} %}
        {% cache {id: 'level-2'} %}
            this text will be cached until both the above ids change
        {% endcache %}
    {% endcache %}


Setup
---

Upload all files to a folder named 'stow' in the plugin directory and then activate from your control panel. No further set-up required.

License
---

This project is licensed under the terms of the MIT license.
