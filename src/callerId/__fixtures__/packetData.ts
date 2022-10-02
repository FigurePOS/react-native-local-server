/**
 * PACKET DATA
 * The data starts with $ symbol, every segment is then delimited with space symbol.
 * 01 - line number (two chars)
 * I - I-inbound / O-outbound (one char) - (always I for Basic units)
 * E - S-start / E-end (one char) - (always S for Basic units)
 * 0000 - call duration in seconds (four chars) - (always 0 for Basic units)
 * G - checksum G-good / B-bad (one char)
 * A2 - type of ring and number of rings (two chars) - (always A0 for Basic units)
 * 12/17 - date mm/dd (five chars)
 * 04:54 - time hh:mm (five chars)
 * PM - AM/PM (two chars)
 * 770-263-7111 - phone number, "Private" or "Out-of-Area" (14 chars)
 * CALLERID.COM - name, can be empty (15 chars)
 */

export const TestPackets = {
    example_: "^^<U>nnnnnn<S>nnnnnn$01 I S 0000 G A0 12/17 04:54 PM 770-263-7111   CALLERID.COM   ",
    no__name: "^^<U>nnnnnn<S>nnnnnn$01 I S 0000 G A0 12/17 04:54 PM 770-263-7111                  ",
    priv_num: "^^<U>nnnnnn<S>nnnnnn$01 I S 0000 G A0 12/17 04:54 PM Private                       ",
    out__num: "^^<U>nnnnnn<S>nnnnnn$01 I S 0000 G A0 12/17 04:54 PM Out-of-Area                   ",
    outbound: "^^<U>nnnnnn<S>nnnnnn$01 O S 0000 G A0 12/17 04:54 PM 770-263-7111   CALLERID.COM   ",
    end_call: "^^<U>nnnnnn<S>nnnnnn$01 I E 0257 G A0 12/17 04:54 PM 770-263-7111   CALLERID.COM   ",
    bad_csum: "^^<U>nnnnnn<S>nnnnnn$01 I S 0000 B A0 12/17 04:54 PM 770-263-7111   CALLERID.COM   ",
}
