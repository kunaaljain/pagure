# -*- coding: utf-8 -*-

"""
 (c) 2015 - Copyright Red Hat Inc

 Authors:
   Pierre-Yves Chibon <pingou@pingoured.fr>

"""

import random
import string

from pagure.lib import model


def id_generator(size=15, chars=string.ascii_uppercase + string.digits):
    """ Generates a random identifier for the given size and using the
    specified characters.
    If no size is specified, it uses 15 as default.
    If no characters are specified, it uses ascii char upper case and
    digits.
    :arg size: the size of the identifier to return.
    :arg chars: the list of characters that can be used in the
        idenfitier.
    """
    return ''.join(random.choice(chars) for x in range(size))


def get_session_by_visitkey(session, sessionid):
    ''' Return a specified VisitUser via its session identifier (visit_key).

    :arg session: the session with which to connect to the database.

    '''
    query = session.query(
        model.PagureUserVisit
    ).filter(
        model.PagureUserVisit.visit_key == sessionid
    )

    return query.first()


def get_users_by_group(session, group):
    ''' Return the list of users for a specified group.

    :arg session: the session with which to connect to the database.

    '''
    query = session.query(
        model.User
    ).filter(
        model.User.id == model.PagureUserGroup.user_id
    ).filter(
        model.PagureUserGroup.group_id == model.PagureGroup.id
    ).filter(
        model.PagureGroup.group_name == group
    ).order_by(
        model.User.user
    )

    return query.all()
