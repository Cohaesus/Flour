group { 'puppet':
  ensure => present,
}

exec { 'apt-get update': 
  command => '/usr/bin/apt-get update',
}

package { 'curl':
  ensure => present,
  require => Exec['apt-get update'],
}

package { 'software-properties-common':
  ensure => present,
  require => Exec['apt-get update'],
}

package { 'python-software-properties':
  ensure => present,
  require => Exec['apt-get update'],
}

package { 'ruby1.9.3':
  ensure => present,
  require => Exec['apt-get update'],
}

package { 'php5-fpm': 
  ensure => present,
  require => Exec['apt-get update'],
}

package { 'php5-mysql': 
  ensure => present,
  require => [
    Exec['apt-get update'],
    Package['php5-fpm']
  ],
  notify => Service['php5-fpm'],
}

package { 'nginx': 
  ensure => present,
  require => Exec['apt-get update'],
}

package { 'build-essential': 
  ensure => present,
  require => Exec['apt-get update'],
}

package { 'git-core': 
  ensure => present,
  require => Exec['apt-get update'],
}

exec { 'add node repo':
  command => '/usr/bin/apt-add-repository ppa:chris-lea/node.js && /usr/bin/apt-get update',
  require => Package['python-software-properties'],
}

package { 'nodejs': 
  ensure => latest,
  require => [Exec['apt-get update'], Exec['add node repo']],
}

exec { 'npm':
  command => '/usr/bin/curl https://npmjs.org/install.sh | /bin/sh',
  require => [Package['nodejs'], Package['curl']],
  environment => 'clean=yes',
}

exec { 'gem install sass': 
  command => '/usr/bin/gem install sass',
  require => Package['ruby1.9.3'],
}

exec { 'node-modules symlink': 
  command => '/bin/rm -rfv /usr/local/node_modules && /bin/rm -rfv /vagrant/node_modules && /bin/mkdir /usr/local/node_modules && /bin/ln -s /usr/local/node_modules /vagrant/node_modules ',
}

exec { 'npm-install-deps':
  command => '/usr/bin/npm install -g grunt-cli bower',
  require => Exec['npm'],
}

exec { 'npm-packages':,
  command => '/usr/bin/npm install',
  require => [Exec['npm-install-deps'], Exec['node-modules symlink']],
  cwd => '/vagrant',
}

package { 'mysql-server': 
  ensure => installed 
}

package { 'mysql-client': 
  ensure => installed 
}

service { 'mysql':
  enable => true,
  ensure => running,
  require => Package['mysql-server'],
}

service { 'php5-fpm':
  enable => true,
  ensure => running,
  require => Package['php5-fpm'],
}


exec { 'set-mysql-password':
  unless => "mysqladmin -uroot -pp0wer status",
  path => ["/bin", "/usr/bin"],
  command => "mysqladmin -uroot password p0wer",
  require => Service["mysql"],
}

exec { 'create-methodone-db':
      unless => "/usr/bin/mysql -ucakephp -pluuurvedecake Methodone",
      command => "/usr/bin/mysql -uroot -pp0wer -e \"create database Methodone; grant all on Methodone.* to cakephp@localhost identified by 'luuurvedecake';\"",
      require => [
        Service["mysql"],
        Exec["set-mysql-password"]
      ],
}

service { 'nginx':
  ensure => running,
  require => Package['nginx'],
}

file { 'nginx-conf':
  path => '/etc/nginx/nginx.conf',
  ensure => file,
  replace => true,
  require => Package['nginx'],
  source => 'puppet:///modules/nginx/nginx.conf',
  notify => Service['nginx'],
}

file { 'vagrant-nginx':
  path => '/etc/nginx/sites-available/vhost.conf',
  ensure => file,
  replace => true,
  require => Package['nginx'],
  source => 'puppet:///modules/nginx/vhost.conf',
  notify => Service['nginx'],
}

file { 'default-nginx-disable':
  path => '/etc/nginx/sites-enabled/default',
  ensure => absent,
  require => Package['nginx'],
}

file { 'vagrant-nginx-enable':
  path => '/etc/nginx/sites-enabled/vhost.conf',
  target => '/etc/nginx/sites-available/vhost.conf',
  ensure => link,
  notify => Service['nginx'],
  require => [
    File['vagrant-nginx'],
    File['default-nginx-disable'],
  ],
}

file { "/var/www/":
  ensure => link,
  target => "/vagrant",
}