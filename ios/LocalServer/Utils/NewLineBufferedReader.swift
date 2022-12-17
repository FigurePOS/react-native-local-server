//
//  NewLineBufferedReader.swift
//  LocalServer
//
//  Created by David Lang on 16.08.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

class NewLineBufferedReader {
    
    private var buffer: String = ""
    
    func appendData(data: Data, numberOfDroppedBytesFromMsgStart: UInt16 = 0) -> Void {
        let parsedData: String = String(decoding: data.suffix(from: Data.Index(numberOfDroppedBytesFromMsgStart)), as: UTF8.self)
        buffer.append(parsedData)
    }
    
    func readData() -> String? {
        guard let range: Range = buffer.rangeOfCharacter(from: CharacterSet.newlines) else {
            return nil
        }
        let result: String = String(buffer[..<range.lowerBound])
        buffer = String(buffer[range.lowerBound...])
        buffer.removeFirst()
        return result
    }
    
    func readLastData() -> String? {
        if (buffer.isEmpty) {
            return nil
        }
        return buffer
    }
    
}
