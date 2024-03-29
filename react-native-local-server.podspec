require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-local-server"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => "https://github.com/FigurePOS/react-native-local-server.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.exclude_files = ["ios/Tests/**/*.{h,m,mm,swift}", "ios/LocalServerForTests-Bridging-Header.h"]

  s.dependency "React-Core"
  s.framework = "Network"

  s.test_spec 'Tests' do |t|
    t.source_files = "ios/**/*.{h,m,mm,swift}"
  end
end
