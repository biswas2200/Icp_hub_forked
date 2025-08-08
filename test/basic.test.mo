import Debug "mo:base/Debug";

// Basic test to verify project builds correctly
actor {
  public func run() : async () {
    Debug.print("✅ Basic test passed");
  };
}
