# Let's make my own blog

> github pages & jekyll  
> for free

## Install Requisites

https://jekyllrb.com/docs/installation/ubuntu/

```bash
# Install Ruby and other prerequisites
$ sudo apt-get install ruby-full build-essential zlib1g-dev

# set up a gem installation directory for my account
$ echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
$ echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
$ echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
$ source ~/.bashrc

# finally install
$ gem install jekyll bundler
```
## Init Jekyll

```bash
# before init, clone remote repository (like $ git clone ...)

# create new jekyll site
$ cd ~/rokong.github.io
$ jekyll new .
# then repository like; 404.html  Gemfile  Gemfile.lock  _config.yml  _posts  about.markdown  index.markdown

# local preview
$ bundle exec jekyll serve
# running as http://127.0.0.1:4000/
```

## Manufacturing Basic Configuration

### _config.yml

- title
- email
- description
- baseurl
- url
- twitter_username
- github_username

### /_drafts/

Drafts are posts without a date in the filename. They’re posts you’re still working on and don’t want to publish yet. To preview drafts, run `$ bundle exec jekyll serve --drafts` command.

## Install Theme

I found awesome jekyll theme in github repositories with `#jekyll-thme`. That is [minimal-mistakes](https://github.com/mmistakes/minimal-mistakes). I've already initialized my own repository, so I am going to apply theme by copy files, not through fork or Gemfile.

I will follow all steps like [quick_start_guide](https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/) in official pages.

### Edit Gemfile

With `bundler`, resolve dependencies easily through editing `Gemfile`. 

```bash
source "https://rubygems.org"

gem "jekyll"
gem "minimal-mistakes-jekyll"
gem "kramdown-parser-gfm"

group :jekyll_plugins do
end
```

then execute resolve dependency by `bundle clean --force`, then `bundle install`. I can see dependencies in `Gemfile.lock`

### copy theme files

```bash
# at first, clone theme repository
$ cd ~
$ git clone git@github.com:mmistakes/minimal-mistakes.git

# then remove unnecessary stuffs
$ rm -rfI .git .editorconfig .gitattributes .github docs test CHANGELOG.md minimal-mistakes-jekyll.gemspec README.md screenshot-layouts.png screenshot.png Gemfile

# copy theme files into repository
$ cp -r ~/minimal-mistakes/* ~/rokong.github.io/
```
then execute jekyll.

### _config.yml

there are much things to configuration.