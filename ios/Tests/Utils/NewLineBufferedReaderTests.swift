//
//  NewLineBufferedReader.swift
//  Tests
//
//  Created by David Lang on 16.08.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import XCTest

class NewLineBufferedReaderTests: XCTestCase {

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }
    
    func testReaderShouldReturnNilWhenEmpty() {
        let reader: NewLineBufferedReader = NewLineBufferedReader()
        XCTAssertNil(reader.readData())
    }
    
    func testReaderShouldReturnSingleString() {
        let reader: NewLineBufferedReader = NewLineBufferedReader()
        reader.appendData(data: "Hello World!\n".data(using: .utf8)!)
        XCTAssertEqual(reader.readData(), "Hello World!")
        XCTAssertNil(reader.readData())
    }

    func testReaderShouldReturnDoubleString() {
        let reader: NewLineBufferedReader = NewLineBufferedReader()
        reader.appendData(data: "Hello World!\nFrom the other side.\n".data(using: .utf8)!)
        XCTAssertEqual(reader.readData(), "Hello World!")
        XCTAssertEqual(reader.readData(), "From the other side.")
        XCTAssertNil(reader.readData())
    }
    
    func testReaderShouldNotReturnStringWithoutNewLine() {
        let reader: NewLineBufferedReader = NewLineBufferedReader()
        reader.appendData(data: "Hello World!".data(using: .utf8)!)
        XCTAssertNil(reader.readData())
    }
    
    func testReaderShouldReturnSingleStringAfterTwoAppends() {
        let reader: NewLineBufferedReader = NewLineBufferedReader()
        reader.appendData(data: "Hello World! ".data(using: .utf8)!)
        reader.appendData(data: "From the other side.\n".data(using: .utf8)!)
        XCTAssertEqual(reader.readData(), "Hello World! From the other side.")
        XCTAssertNil(reader.readData())
    }
    
    func testReaderShouldReturnMessageWithCorrectNumberOfDroppedBytesFromStart() {
        let reader: NewLineBufferedReader = NewLineBufferedReader()
        reader.appendData(data: "Hello World! ".data(using: .utf8)!, numberOfDroppedBytesFromMsgStart: 6)
        reader.appendData(data: "From the other side.\n".data(using: .utf8)!, numberOfDroppedBytesFromMsgStart: 5)
        XCTAssertEqual(reader.readData(), "World! the other side.")
        XCTAssertNil(reader.readData())
    }
    
}
