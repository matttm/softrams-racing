/**
 * Testing utilities
 */

import {of} from 'rxjs';

/**
 * Creates a mock store and spies on it
 */
export function establishLocalStorageSpies() {
    let store = {};
    const mockLocalStorage = {
        getItem: (key: string): string => {
            return key in store ? store[key] : null;
        },
        setItem: (key: string, value: string) => {
            store[key] = `${value}`;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        }
    };
    spyOn(localStorage, 'getItem')
        .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
        .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
        .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
        .and.callFake(mockLocalStorage.clear);
}

export function establishAppServiceSpies(service) {
    spyOn(service, 'getTeams').and.returnValue(of([]));
    // getMembers: () => of( [] ),
    // deleteMember: () => of(),
    // getMemberById: (id) => of()
}

export function establishActivatedRouteSpies(route, data) {
    function wrap(_data) {
        return of({
            get: (key) => _data[key]
        });
    }
    spyOn(route, 'queryParams').and.returnValue(wrap(data));
}
