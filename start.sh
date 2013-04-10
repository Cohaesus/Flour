#!/bin/bash
cd /vagrant
git submodule init && git submodule update
bower install
grunt build