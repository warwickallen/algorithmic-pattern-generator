#!/usr/bin/perl

# generate-build-number.pl
#
# Prints a build number in the form:
#   ${VERSION}-${BRANCH}-${HASH}-${USER}-${HOST}-${TIMESTAMP}
# where:
#   - ${VERSION}   = Three-segment Semantic version number
#   - ${BRANCH}    = Current git branch
#   - ${HASH}      = Short commit hash of HEAD
#   - ${USER}      = Git username, with a fallback to the OS username
#   - ${HOST}      = Host machine's name
#   - ${TIMESTAMP} = UTC time in yyyymmddThhMMss format
# and where any field for which the data is unavailable is filled with a tilde
# ("~"), except for ${VERSION}, which becomes "~.~.~" when unavailable.  Any
# character within a field (other than ${VERSION}) that is not a Unicode word
# character*, a parenthesis  ("(" or ")"), or a tilde is replaced with an
# underscore ("_").
#
# * A Unicode word character is a Unicode alphanumeric character, an underscore
#   ("_") or other connector punctuation character, or a Unicode mark.

use warnings;
use strict;
use POSIX;

sub version {
  open FH, 'VERSION';
  local $_ = <FH>;
  close FH;
  $_ = '~.~.~' unless defined;
  chomp;
  $_
}
sub git {
  local $_ = `git @_ 2>/dev/null`;
  $_ = '~' if $?;
  chomp;
  $_
}
sub safe {
  join '', map { s/[^\w()~]/_/ug; $_ } @_
}

my $VERSION   = version();
my $BRANCH    = safe git('rev-parse --abbrev-ref HEAD');
my $HASH      = safe git('rev-parse --short HEAD');
my $USER      = safe git('config --get user.name') || $ENV{USERNAME};
my $HOST      = safe $ENV{HOSTNAME} || '~';
my $TIMESTAMP = safe strftime('%Y%m%dT%H%M%S', gmtime time);

print "${VERSION}-${BRANCH}-${HASH}-${USER}-${HOST}-${TIMESTAMP}"
