import { REGEXPS } from '@/common/constants';

export default function() {
    const [_, siteID] = window.location.pathname.split(REGEXPS.splitIDs);
    return siteID;
}