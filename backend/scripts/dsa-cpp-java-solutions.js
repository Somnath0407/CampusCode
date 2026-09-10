// C++ and Java reference-solution BODIES for the 51-problem DSA bank, which
// previously only had a JavaScript reference solution (the C++/Java starter
// code existed, but nothing verified a correct answer for those languages).
//
// Each entry is just the algorithm body — it gets spliced into that
// problem's existing startCode template (replacing "// Write your code
// here" through the function's closing brace) via buildFullProgram() in
// verifyAndSeedCppJavaSolutions.js, so the surrounding stdin-parsing/main()
// boilerplate (already correct, already shipped) is reused as-is.

const solutions = {
    "Add Two Numbers": {
        cpp: `return a + b;`,
        java: `return a + b;`,
    },
    "Pair with Target Sum": {
        cpp: `unordered_map<int,int> seen;
for (int i = 0; i < (int)nums.size(); i++) {
    int need = target - nums[i];
    auto it = seen.find(need);
    if (it != seen.end()) return {it->second, i};
    seen[nums[i]] = i;
}
return {-1};`,
        java: `Map<Integer,Integer> seen = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int need = target - nums[i];
    if (seen.containsKey(need)) return new int[]{seen.get(need), i};
    seen.put(nums[i], i);
}
return new int[]{-1};`,
    },
    "Rearrange 0 and 1": {
        cpp: `int zeroCount = 0;
for (int x : nums) if (x == 0) zeroCount++;
vector<int> res(nums.size());
for (int i = 0; i < (int)nums.size(); i++) res[i] = (i < zeroCount) ? 0 : 1;
return res;`,
        java: `int zeroCount = 0;
for (int x : nums) if (x == 0) zeroCount++;
int[] res = new int[nums.length];
for (int i = 0; i < nums.length; i++) res[i] = (i < zeroCount) ? 0 : 1;
return res;`,
    },
    "Remove Duplicates": {
        cpp: `set<int> s(nums.begin(), nums.end());
return vector<int>(s.begin(), s.end());`,
        java: `TreeSet<Integer> s = new TreeSet<>();
for (int x : nums) s.add(x);
int[] res = new int[s.size()];
int idx = 0;
for (int x : s) res[idx++] = x;
return res;`,
    },
    "Squaring a Sorted Array": {
        cpp: `vector<int> res;
for (int x : nums) res.push_back(x * x);
sort(res.begin(), res.end());
return res;`,
        java: `int[] res = new int[nums.length];
for (int i = 0; i < nums.length; i++) res[i] = nums[i] * nums[i];
Arrays.sort(res);
return res;`,
    },
    "Triplet Sum to Zero": {
        cpp: `vector<int> arr = nums;
sort(arr.begin(), arr.end());
vector<vector<int>> res;
int n = arr.size();
for (int i = 0; i < n - 2; i++) {
    if (i > 0 && arr[i] == arr[i - 1]) continue;
    int lo = i + 1, hi = n - 1;
    while (lo < hi) {
        int sum = arr[i] + arr[lo] + arr[hi];
        if (sum == 0) {
            res.push_back({arr[i], arr[lo], arr[hi]});
            lo++; hi--;
            while (lo < hi && arr[lo] == arr[lo - 1]) lo++;
            while (lo < hi && arr[hi] == arr[hi + 1]) hi--;
        } else if (sum < 0) lo++; else hi--;
    }
}
return res;`,
        java: `int[] arr = nums.clone();
Arrays.sort(arr);
List<int[]> res = new ArrayList<>();
int n = arr.length;
for (int i = 0; i < n - 2; i++) {
    if (i > 0 && arr[i] == arr[i - 1]) continue;
    int lo = i + 1, hi = n - 1;
    while (lo < hi) {
        int sum = arr[i] + arr[lo] + arr[hi];
        if (sum == 0) {
            res.add(new int[]{arr[i], arr[lo], arr[hi]});
            lo++; hi--;
            while (lo < hi && arr[lo] == arr[lo - 1]) lo++;
            while (lo < hi && arr[hi] == arr[hi + 1]) hi--;
        } else if (sum < 0) lo++; else hi--;
    }
}
return res.toArray(new int[0][]);`,
    },
    "Triplet Sum Close to Target": {
        cpp: `vector<int> arr = nums;
sort(arr.begin(), arr.end());
int best = arr[0] + arr[1] + arr[2];
int n = arr.size();
for (int i = 0; i < n - 2; i++) {
    int lo = i + 1, hi = n - 1;
    while (lo < hi) {
        int sum = arr[i] + arr[lo] + arr[hi];
        if (abs(sum - target) < abs(best - target) || (abs(sum - target) == abs(best - target) && sum < best)) best = sum;
        if (sum == target) return sum;
        else if (sum < target) lo++; else hi--;
    }
}
return best;`,
        java: `int[] arr = nums.clone();
Arrays.sort(arr);
int best = arr[0] + arr[1] + arr[2];
int n = arr.length;
for (int i = 0; i < n - 2; i++) {
    int lo = i + 1, hi = n - 1;
    while (lo < hi) {
        int sum = arr[i] + arr[lo] + arr[hi];
        if (Math.abs(sum - target) < Math.abs(best - target) || (Math.abs(sum - target) == Math.abs(best - target) && sum < best)) best = sum;
        if (sum == target) return sum;
        else if (sum < target) lo++; else hi--;
    }
}
return best;`,
    },
    "Triplets with Smaller Sum": {
        cpp: `vector<int> arr = nums;
sort(arr.begin(), arr.end());
long long count = 0;
int n = arr.size();
for (int i = 0; i < n - 2; i++) {
    int lo = i + 1, hi = n - 1;
    while (lo < hi) {
        if (arr[i] + arr[lo] + arr[hi] < target) { count += hi - lo; lo++; }
        else hi--;
    }
}
return count;`,
        java: `int[] arr = nums.clone();
Arrays.sort(arr);
long count = 0;
int n = arr.length;
for (int i = 0; i < n - 2; i++) {
    int lo = i + 1, hi = n - 1;
    while (lo < hi) {
        if (arr[i] + arr[lo] + arr[hi] < target) { count += hi - lo; lo++; }
        else hi--;
    }
}
return count;`,
    },
    "Subarrays with Product Less than a Target": {
        cpp: `if (target <= 1) return 0;
long long product = 1;
int count = 0, left = 0;
for (int right = 0; right < (int)nums.size(); right++) {
    product *= nums[right];
    while (product >= target) { product /= nums[left]; left++; }
    count += right - left + 1;
}
return count;`,
        java: `if (target <= 1) return 0;
long product = 1;
int count = 0, left = 0;
for (int right = 0; right < nums.length; right++) {
    product *= nums[right];
    while (product >= target) { product /= nums[left]; left++; }
    count += right - left + 1;
}
return count;`,
    },
    "Dutch National Flag Problem": {
        cpp: `vector<int> arr = nums;
int lo = 0, mid = 0, hi = (int)arr.size() - 1;
while (mid <= hi) {
    if (arr[mid] == 0) { swap(arr[lo], arr[mid]); lo++; mid++; }
    else if (arr[mid] == 1) mid++;
    else { swap(arr[mid], arr[hi]); hi--; }
}
return arr;`,
        java: `int[] arr = nums.clone();
int lo = 0, mid = 0, hi = arr.length - 1;
while (mid <= hi) {
    if (arr[mid] == 0) { int t = arr[lo]; arr[lo] = arr[mid]; arr[mid] = t; lo++; mid++; }
    else if (arr[mid] == 1) mid++;
    else { int t = arr[mid]; arr[mid] = arr[hi]; arr[hi] = t; hi--; }
}
return arr;`,
    },
    "Quadruple Sum to Target": {
        cpp: `vector<int> arr = nums;
sort(arr.begin(), arr.end());
int n = arr.size();
vector<vector<int>> res;
for (int i = 0; i < n - 3; i++) {
    if (i > 0 && arr[i] == arr[i - 1]) continue;
    for (int j = i + 1; j < n - 2; j++) {
        if (j > i + 1 && arr[j] == arr[j - 1]) continue;
        int lo = j + 1, hi = n - 1;
        while (lo < hi) {
            long long sum = (long long)arr[i] + arr[j] + arr[lo] + arr[hi];
            if (sum == target) {
                res.push_back({arr[i], arr[j], arr[lo], arr[hi]});
                lo++; hi--;
                while (lo < hi && arr[lo] == arr[lo - 1]) lo++;
                while (lo < hi && arr[hi] == arr[hi + 1]) hi--;
            } else if (sum < target) lo++; else hi--;
        }
    }
}
return res;`,
        java: `int[] arr = nums.clone();
Arrays.sort(arr);
int n = arr.length;
List<int[]> res = new ArrayList<>();
for (int i = 0; i < n - 3; i++) {
    if (i > 0 && arr[i] == arr[i - 1]) continue;
    for (int j = i + 1; j < n - 2; j++) {
        if (j > i + 1 && arr[j] == arr[j - 1]) continue;
        int lo = j + 1, hi = n - 1;
        while (lo < hi) {
            long sum = (long)arr[i] + arr[j] + arr[lo] + arr[hi];
            if (sum == target) {
                res.add(new int[]{arr[i], arr[j], arr[lo], arr[hi]});
                lo++; hi--;
                while (lo < hi && arr[lo] == arr[lo - 1]) lo++;
                while (lo < hi && arr[hi] == arr[hi + 1]) hi--;
            } else if (sum < target) lo++; else hi--;
        }
    }
}
return res.toArray(new int[0][]);`,
    },
    "Comparing Strings containing Backspaces": {
        cpp: `string b1, b2;
for (char c : s) { if (c == '#') { if (!b1.empty()) b1.pop_back(); } else b1.push_back(c); }
for (char c : t) { if (c == '#') { if (!b2.empty()) b2.pop_back(); } else b2.push_back(c); }
return b1 == b2;`,
        java: `StringBuilder b1 = new StringBuilder();
for (char c : s.toCharArray()) { if (c == '#') { if (b1.length() > 0) b1.deleteCharAt(b1.length() - 1); } else b1.append(c); }
StringBuilder b2 = new StringBuilder();
for (char c : t.toCharArray()) { if (c == '#') { if (b2.length() > 0) b2.deleteCharAt(b2.length() - 1); } else b2.append(c); }
return b1.toString().equals(b2.toString());`,
    },
    "Minimum Window Sort": {
        cpp: `vector<int> sorted_ = nums;
sort(sorted_.begin(), sorted_.end());
int n = (int)nums.size();
int start = -1, end = -1;
for (int i = 0; i < n; i++) if (nums[i] != sorted_[i]) { start = i; break; }
if (start == -1) return 0;
for (int i = n - 1; i >= 0; i--) if (nums[i] != sorted_[i]) { end = i; break; }
return end - start + 1;`,
        java: `int[] sorted_ = nums.clone();
Arrays.sort(sorted_);
int n = nums.length;
int start = -1, end = -1;
for (int i = 0; i < n; i++) if (nums[i] != sorted_[i]) { start = i; break; }
if (start == -1) return 0;
for (int i = n - 1; i >= 0; i--) if (nums[i] != sorted_[i]) { end = i; break; }
return end - start + 1;`,
    },
    "LinkedList Cycle": {
        cpp: `if (pos < 0 || n == 0) return false;
int slow = 0, fast = 0;
while (true) {
    slow = (slow == n - 1) ? pos : slow + 1;
    if (slow == -1) return false;
    fast = (fast == n - 1) ? pos : fast + 1;
    if (fast == -1) return false;
    fast = (fast == n - 1) ? pos : fast + 1;
    if (fast == -1) return false;
    if (slow == fast) return true;
}`,
        java: `if (pos < 0 || n == 0) return false;
int slow = 0, fast = 0;
while (true) {
    slow = (slow == n - 1) ? pos : slow + 1;
    if (slow == -1) return false;
    fast = (fast == n - 1) ? pos : fast + 1;
    if (fast == -1) return false;
    fast = (fast == n - 1) ? pos : fast + 1;
    if (fast == -1) return false;
    if (slow == fast) return true;
}`,
    },
    "Start of LinkedList Cycle": {
        cpp: `if (pos < 0 || n == 0) return -1;
int slow = 0, fast = 0;
while (true) {
    slow = (slow == n - 1) ? pos : slow + 1;
    if (slow == -1) return -1;
    fast = (fast == n - 1) ? pos : fast + 1;
    if (fast == -1) return -1;
    fast = (fast == n - 1) ? pos : fast + 1;
    if (fast == -1) return -1;
    if (slow == fast) break;
}
int ptr = 0;
while (ptr != slow) {
    ptr = (ptr == n - 1) ? pos : ptr + 1;
    slow = (slow == n - 1) ? pos : slow + 1;
}
return ptr;`,
        java: `if (pos < 0 || n == 0) return -1;
int slow = 0, fast = 0;
while (true) {
    slow = (slow == n - 1) ? pos : slow + 1;
    if (slow == -1) return -1;
    fast = (fast == n - 1) ? pos : fast + 1;
    if (fast == -1) return -1;
    fast = (fast == n - 1) ? pos : fast + 1;
    if (fast == -1) return -1;
    if (slow == fast) break;
}
int ptr = 0;
while (ptr != slow) {
    ptr = (ptr == n - 1) ? pos : ptr + 1;
    slow = (slow == n - 1) ? pos : slow + 1;
}
return ptr;`,
    },
    "Happy Number": {
        cpp: `set<int> seen;
while (n != 1 && seen.find(n) == seen.end()) {
    seen.insert(n);
    int sum = 0;
    while (n > 0) { int d = n % 10; sum += d * d; n /= 10; }
    n = sum;
}
return n == 1;`,
        java: `Set<Integer> seen = new HashSet<>();
while (n != 1 && !seen.contains(n)) {
    seen.add(n);
    int sum = 0;
    while (n > 0) { int d = n % 10; sum += d * d; n /= 10; }
    n = sum;
}
return n == 1;`,
    },
    "Find Duplicate Number": {
        cpp: `int slow = nums[0], fast = nums[0];
do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow != fast);
slow = nums[0];
while (slow != fast) { slow = nums[slow]; fast = nums[fast]; }
return slow;`,
        java: `int slow = nums[0], fast = nums[0];
do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow != fast);
slow = nums[0];
while (slow != fast) { slow = nums[slow]; fast = nums[fast]; }
return slow;`,
    },
    "Middle of the LinkedList": {
        cpp: `int slow = 0, fast = 0;
int n = (int)nums.size();
while (fast < n - 1 && fast + 1 < n) { slow++; fast += 2; }
return nums[slow];`,
        java: `int slow = 0, fast = 0;
int n = nums.length;
while (fast < n - 1 && fast + 1 < n) { slow++; fast += 2; }
return nums[slow];`,
    },
    "Palindrome LinkedList": {
        cpp: `int n = (int)nums.size();
for (int i = 0; i < n / 2; i++) if (nums[i] != nums[n - 1 - i]) return false;
return true;`,
        java: `int n = nums.length;
for (int i = 0; i < n / 2; i++) if (nums[i] != nums[n - 1 - i]) return false;
return true;`,
    },
    "Rearrange a LinkedList": {
        cpp: `vector<int> res;
int lo = 0, hi = (int)nums.size() - 1;
bool turnLeft = true;
while (lo <= hi) {
    if (turnLeft) { res.push_back(nums[lo]); lo++; } else { res.push_back(nums[hi]); hi--; }
    turnLeft = !turnLeft;
}
return res;`,
        java: `List<Integer> res = new ArrayList<>();
int lo = 0, hi = nums.length - 1;
boolean turnLeft = true;
while (lo <= hi) {
    if (turnLeft) { res.add(nums[lo]); lo++; } else { res.add(nums[hi]); hi--; }
    turnLeft = !turnLeft;
}
int[] out = new int[res.size()];
for (int i = 0; i < out.length; i++) out[i] = res.get(i);
return out;`,
    },
    "Cycle in a Circular Array": {
        cpp: `int n = (int)nums.size();
auto nxt = [&](int i) { return (((i + nums[i]) % n) + n) % n; };
for (int i = 0; i < n; i++) {
    if (nums[i] == 0) continue;
    bool isForward = nums[i] > 0;
    int slow = i, fast = i;
    bool valid = true;
    while (valid) {
        slow = nxt(slow);
        if (nums[slow] == 0 || (nums[slow] > 0) != isForward) { valid = false; break; }
        fast = nxt(fast);
        if (nums[fast] == 0 || (nums[fast] > 0) != isForward) { valid = false; break; }
        fast = nxt(fast);
        if (nums[fast] == 0 || (nums[fast] > 0) != isForward) { valid = false; break; }
        if (slow == fast) {
            if (slow == nxt(slow)) { valid = false; break; }
            return true;
        }
    }
}
return false;`,
        java: `int n = nums.length;
java.util.function.IntUnaryOperator nxt = i -> (((i + nums[i]) % n) + n) % n;
for (int i = 0; i < n; i++) {
    if (nums[i] == 0) continue;
    boolean isForward = nums[i] > 0;
    int slow = i, fast = i;
    boolean valid = true;
    while (valid) {
        slow = nxt.applyAsInt(slow);
        if (nums[slow] == 0 || (nums[slow] > 0) != isForward) { valid = false; break; }
        fast = nxt.applyAsInt(fast);
        if (nums[fast] == 0 || (nums[fast] > 0) != isForward) { valid = false; break; }
        fast = nxt.applyAsInt(fast);
        if (nums[fast] == 0 || (nums[fast] > 0) != isForward) { valid = false; break; }
        if (slow == fast) {
            if (slow == nxt.applyAsInt(slow)) { valid = false; break; }
            return true;
        }
    }
}
return false;`,
    },
    "Maximum Sum Subarray of Size K": {
        cpp: `long long sum = 0;
for (int i = 0; i < k; i++) sum += nums[i];
long long best = sum;
for (int i = k; i < (int)nums.size(); i++) { sum += nums[i] - nums[i - k]; best = max(best, sum); }
return best;`,
        java: `long sum = 0;
for (int i = 0; i < k; i++) sum += nums[i];
long best = sum;
for (int i = k; i < nums.length; i++) { sum += nums[i] - nums[i - k]; best = Math.max(best, sum); }
return best;`,
    },
    "Smallest Subarray with a given sum": {
        cpp: `int left = 0, n = (int)nums.size();
long long sum = 0;
int best = INT_MAX;
for (int right = 0; right < n; right++) {
    sum += nums[right];
    while (sum >= target) { best = min(best, right - left + 1); sum -= nums[left]; left++; }
}
return best == INT_MAX ? 0 : best;`,
        java: `int left = 0, n = nums.length;
long sum = 0;
int best = Integer.MAX_VALUE;
for (int right = 0; right < n; right++) {
    sum += nums[right];
    while (sum >= target) { best = Math.min(best, right - left + 1); sum -= nums[left]; left++; }
}
return best == Integer.MAX_VALUE ? 0 : best;`,
    },
    "Longest Substring with K Distinct Characters": {
        cpp: `unordered_map<char,int> count;
int left = 0, best = 0;
for (int right = 0; right < (int)s.size(); right++) {
    count[s[right]]++;
    while ((int)count.size() > k) {
        char c = s[left];
        count[c]--;
        if (count[c] == 0) count.erase(c);
        left++;
    }
    best = max(best, right - left + 1);
}
return best;`,
        java: `Map<Character,Integer> count = new HashMap<>();
int left = 0, best = 0;
for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    count.put(c, count.getOrDefault(c, 0) + 1);
    while (count.size() > k) {
        char lc = s.charAt(left);
        count.put(lc, count.get(lc) - 1);
        if (count.get(lc) == 0) count.remove(lc);
        left++;
    }
    best = Math.max(best, right - left + 1);
}
return best;`,
    },
    "Fruits into Baskets": {
        cpp: `unordered_map<string,int> count;
int left = 0, best = 0;
for (int right = 0; right < (int)fruits.size(); right++) {
    count[fruits[right]]++;
    while ((int)count.size() > 2) {
        const string& c = fruits[left];
        count[c]--;
        if (count[c] == 0) count.erase(c);
        left++;
    }
    best = max(best, right - left + 1);
}
return best;`,
        java: `Map<String,Integer> count = new HashMap<>();
int left = 0, best = 0;
for (int right = 0; right < fruits.length; right++) {
    count.put(fruits[right], count.getOrDefault(fruits[right], 0) + 1);
    while (count.size() > 2) {
        String c = fruits[left];
        count.put(c, count.get(c) - 1);
        if (count.get(c) == 0) count.remove(c);
        left++;
    }
    best = Math.max(best, right - left + 1);
}
return best;`,
    },
    "No-repeat Substring": {
        cpp: `unordered_map<char,int> seen;
int left = 0, best = 0;
for (int right = 0; right < (int)s.size(); right++) {
    char c = s[right];
    if (seen.count(c) && seen[c] >= left) left = seen[c] + 1;
    seen[c] = right;
    best = max(best, right - left + 1);
}
return best;`,
        java: `Map<Character,Integer> seen = new HashMap<>();
int left = 0, best = 0;
for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    if (seen.containsKey(c) && seen.get(c) >= left) left = seen.get(c) + 1;
    seen.put(c, right);
    best = Math.max(best, right - left + 1);
}
return best;`,
    },
    "Longest Substring with Same Letters after Replacement": {
        cpp: `unordered_map<char,int> count;
int left = 0, maxCount = 0, best = 0;
for (int right = 0; right < (int)s.size(); right++) {
    count[s[right]]++;
    maxCount = max(maxCount, count[s[right]]);
    while ((right - left + 1) - maxCount > k) {
        count[s[left]]--;
        left++;
    }
    best = max(best, right - left + 1);
}
return best;`,
        java: `Map<Character,Integer> count = new HashMap<>();
int left = 0, maxCount = 0, best = 0;
for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    count.put(c, count.getOrDefault(c, 0) + 1);
    maxCount = Math.max(maxCount, count.get(c));
    while ((right - left + 1) - maxCount > k) {
        char lc = s.charAt(left);
        count.put(lc, count.get(lc) - 1);
        left++;
    }
    best = Math.max(best, right - left + 1);
}
return best;`,
    },
    "Longest Subarray with Ones after Replacement": {
        cpp: `int left = 0, zeros = 0, best = 0;
for (int right = 0; right < (int)nums.size(); right++) {
    if (nums[right] == 0) zeros++;
    while (zeros > k) { if (nums[left] == 0) zeros--; left++; }
    best = max(best, right - left + 1);
}
return best;`,
        java: `int left = 0, zeros = 0, best = 0;
for (int right = 0; right < nums.length; right++) {
    if (nums[right] == 0) zeros++;
    while (zeros > k) { if (nums[left] == 0) zeros--; left++; }
    best = Math.max(best, right - left + 1);
}
return best;`,
    },
    "Minimum Size Subarray Sum": {
        cpp: `int left = 0, n = (int)nums.size();
long long sum = 0;
int best = INT_MAX;
for (int right = 0; right < n; right++) {
    sum += nums[right];
    while (sum >= target) { best = min(best, right - left + 1); sum -= nums[left]; left++; }
}
return best == INT_MAX ? 0 : best;`,
        java: `int left = 0, n = nums.length;
long sum = 0;
int best = Integer.MAX_VALUE;
for (int right = 0; right < n; right++) {
    sum += nums[right];
    while (sum >= target) { best = Math.min(best, right - left + 1); sum -= nums[left]; left++; }
}
return best == Integer.MAX_VALUE ? 0 : best;`,
    },
    "Minimum Size Substring": {
        cpp: `if (t.size() > s.size()) return "";
unordered_map<char,int> need;
for (char c : t) need[c]++;
int missing = (int)t.size(), left = 0, bestLen = INT_MAX, bestStart = 0;
for (int right = 0; right < (int)s.size(); right++) {
    char c = s[right];
    if (need.count(c)) {
        if (need[c] > 0) missing--;
        need[c]--;
    }
    while (missing == 0) {
        if (right - left + 1 < bestLen) { bestLen = right - left + 1; bestStart = left; }
        char lc = s[left];
        if (need.count(lc)) {
            need[lc]++;
            if (need[lc] > 0) missing++;
        }
        left++;
    }
}
return bestLen == INT_MAX ? "" : s.substr(bestStart, bestLen);`,
        java: `if (t.length() > s.length()) return "";
Map<Character,Integer> need = new HashMap<>();
for (char c : t.toCharArray()) need.put(c, need.getOrDefault(c, 0) + 1);
int missing = t.length(), left = 0, bestLen = Integer.MAX_VALUE, bestStart = 0;
for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    if (need.containsKey(c)) {
        if (need.get(c) > 0) missing--;
        need.put(c, need.get(c) - 1);
    }
    while (missing == 0) {
        if (right - left + 1 < bestLen) { bestLen = right - left + 1; bestStart = left; }
        char lc = s.charAt(left);
        if (need.containsKey(lc)) {
            need.put(lc, need.get(lc) + 1);
            if (need.get(lc) > 0) missing++;
        }
        left++;
    }
}
return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);`,
    },
    "Permutation in a String": {
        cpp: `if (t.size() > s.size()) return false;
vector<int> need(26, 0), win(26, 0);
for (char c : t) need[c - 'a']++;
for (int i = 0; i < (int)s.size(); i++) {
    win[s[i] - 'a']++;
    if (i >= (int)t.size()) win[s[i - (int)t.size()] - 'a']--;
    if (i >= (int)t.size() - 1 && need == win) return true;
}
return false;`,
        java: `if (t.length() > s.length()) return false;
int[] need = new int[26], win = new int[26];
for (char c : t.toCharArray()) need[c - 'a']++;
for (int i = 0; i < s.length(); i++) {
    win[s.charAt(i) - 'a']++;
    if (i >= t.length()) win[s.charAt(i - t.length()) - 'a']--;
    if (i >= t.length() - 1 && Arrays.equals(need, win)) return true;
}
return false;`,
    },
    "String Anagrams": {
        cpp: `if (t.size() > s.size()) return {};
vector<int> need(26, 0), win(26, 0);
for (char c : t) need[c - 'a']++;
vector<int> res;
for (int i = 0; i < (int)s.size(); i++) {
    win[s[i] - 'a']++;
    if (i >= (int)t.size()) win[s[i - (int)t.size()] - 'a']--;
    if (i >= (int)t.size() - 1 && need == win) res.push_back(i - (int)t.size() + 1);
}
return res;`,
        java: `if (t.length() > s.length()) return new int[0];
int[] need = new int[26], win = new int[26];
for (char c : t.toCharArray()) need[c - 'a']++;
List<Integer> resList = new ArrayList<>();
for (int i = 0; i < s.length(); i++) {
    win[s.charAt(i) - 'a']++;
    if (i >= t.length()) win[s.charAt(i - t.length()) - 'a']--;
    if (i >= t.length() - 1 && Arrays.equals(need, win)) resList.add(i - t.length() + 1);
}
int[] res = new int[resList.size()];
for (int i = 0; i < res.length; i++) res[i] = resList.get(i);
return res;`,
    },
    "Words Concatenation": {
        cpp: `if (words.empty()) return {};
int wl = (int)words[0].size();
int total = wl * (int)words.size();
if (total > (int)s.size()) return {};
unordered_map<string,int> need;
for (auto& w : words) need[w]++;
vector<int> res;
for (int i = 0; i + total <= (int)s.size(); i++) {
    unordered_map<string,int> seen;
    int j = 0;
    for (; j < (int)words.size(); j++) {
        string w = s.substr(i + j * wl, wl);
        if (!need.count(w)) break;
        seen[w]++;
        if (seen[w] > need[w]) break;
    }
    if (j == (int)words.size()) res.push_back(i);
}
return res;`,
        java: `if (words.length == 0) return new int[0];
int wl = words[0].length();
int total = wl * words.length;
if (total > s.length()) return new int[0];
Map<String,Integer> need = new HashMap<>();
for (String w : words) need.put(w, need.getOrDefault(w, 0) + 1);
List<Integer> resList = new ArrayList<>();
for (int i = 0; i + total <= s.length(); i++) {
    Map<String,Integer> seen = new HashMap<>();
    int j = 0;
    for (; j < words.length; j++) {
        String w = s.substring(i + j * wl, i + j * wl + wl);
        if (!need.containsKey(w)) break;
        seen.put(w, seen.getOrDefault(w, 0) + 1);
        if (seen.get(w) > need.get(w)) break;
    }
    if (j == words.length) resList.add(i);
}
int[] res = new int[resList.size()];
for (int i = 0; i < res.length; i++) res[i] = resList.get(i);
return res;`,
    },
    "Maximum Subarray Sum": {
        cpp: `int cur = nums[0], best = nums[0];
for (int i = 1; i < (int)nums.size(); i++) { cur = max(nums[i], cur + nums[i]); best = max(best, cur); }
return best;`,
        java: `int cur = nums[0], best = nums[0];
for (int i = 1; i < nums.length; i++) { cur = Math.max(nums[i], cur + nums[i]); best = Math.max(best, cur); }
return best;`,
    },
    "Minimum Subarray Sum": {
        cpp: `int cur = nums[0], best = nums[0];
for (int i = 1; i < (int)nums.size(); i++) { cur = min(nums[i], cur + nums[i]); best = min(best, cur); }
return best;`,
        java: `int cur = nums[0], best = nums[0];
for (int i = 1; i < nums.length; i++) { cur = Math.min(nums[i], cur + nums[i]); best = Math.min(best, cur); }
return best;`,
    },
    "Maximum Product Subarray": {
        cpp: `int curMax = nums[0], curMin = nums[0], best = nums[0];
for (int i = 1; i < (int)nums.size(); i++) {
    int x = nums[i];
    int candMax = max({x, curMax * x, curMin * x});
    int candMin = min({x, curMax * x, curMin * x});
    curMax = candMax; curMin = candMin;
    best = max(best, curMax);
}
return best;`,
        java: `int curMax = nums[0], curMin = nums[0], best = nums[0];
for (int i = 1; i < nums.length; i++) {
    int x = nums[i];
    int candMax = Math.max(x, Math.max(curMax * x, curMin * x));
    int candMin = Math.min(x, Math.min(curMax * x, curMin * x));
    curMax = candMax; curMin = candMin;
    best = Math.max(best, curMax);
}
return best;`,
    },
    "Maximum Subarray Sum with One Deletion": {
        cpp: `int noDelete = nums[0], withDelete = 0, best = nums[0];
for (int i = 1; i < (int)nums.size(); i++) {
    withDelete = max(withDelete + nums[i], noDelete);
    noDelete = max(noDelete + nums[i], nums[i]);
    best = max({best, noDelete, withDelete});
}
return best;`,
        java: `int noDelete = nums[0], withDelete = 0, best = nums[0];
for (int i = 1; i < nums.length; i++) {
    withDelete = Math.max(withDelete + nums[i], noDelete);
    noDelete = Math.max(noDelete + nums[i], nums[i]);
    best = Math.max(best, Math.max(noDelete, withDelete));
}
return best;`,
    },
    "Maximum Absolute Sum of Any Subarray": {
        cpp: `int maxCur = 0, minCur = 0, maxBest = 0, minBest = 0;
for (int x : nums) {
    maxCur = max(0, maxCur) + x;
    minCur = min(0, minCur) + x;
    maxBest = max(maxBest, maxCur);
    minBest = min(minBest, minCur);
}
return max(maxBest, -minBest);`,
        java: `int maxCur = 0, minCur = 0, maxBest = 0, minBest = 0;
for (int x : nums) {
    maxCur = Math.max(0, maxCur) + x;
    minCur = Math.min(0, minCur) + x;
    maxBest = Math.max(maxBest, maxCur);
    minBest = Math.min(minBest, minCur);
}
return Math.max(maxBest, -minBest);`,
    },
    "Maximum Sum in Circular Array": {
        cpp: `int total = 0, curMax = 0, best = INT_MIN, curMin = 0, worst = INT_MAX;
for (int x : nums) {
    curMax = max(curMax, 0) + x; best = max(best, curMax);
    curMin = min(curMin, 0) + x; worst = min(worst, curMin);
    total += x;
}
if (best < 0) return best;
return max(best, total - worst);`,
        java: `int total = 0, curMax = 0, best = Integer.MIN_VALUE, curMin = 0, worst = Integer.MAX_VALUE;
for (int x : nums) {
    curMax = Math.max(curMax, 0) + x; best = Math.max(best, curMax);
    curMin = Math.min(curMin, 0) + x; worst = Math.min(worst, curMin);
    total += x;
}
if (best < 0) return best;
return Math.max(best, total - worst);`,
    },
    "Subarray Sum Equals K": {
        cpp: `unordered_map<int,int> count;
count[0] = 1;
int sum = 0, total = 0;
for (int x : nums) {
    sum += x;
    auto it = count.find(sum - target);
    if (it != count.end()) total += it->second;
    count[sum]++;
}
return total;`,
        java: `Map<Integer,Integer> count = new HashMap<>();
count.put(0, 1);
int sum = 0, total = 0;
for (int x : nums) {
    sum += x;
    total += count.getOrDefault(sum - target, 0);
    count.put(sum, count.getOrDefault(sum, 0) + 1);
}
return total;`,
    },
    "Find Pivot Index": {
        cpp: `long long total = 0;
for (int x : nums) total += x;
long long left = 0;
for (int i = 0; i < (int)nums.size(); i++) {
    if (left == total - left - nums[i]) return i;
    left += nums[i];
}
return -1;`,
        java: `long total = 0;
for (int x : nums) total += x;
long left = 0;
for (int i = 0; i < nums.length; i++) {
    if (left == total - left - nums[i]) return i;
    left += nums[i];
}
return -1;`,
    },
    "Subarray Sums Divisible By K": {
        cpp: `unordered_map<int,int> count;
count[0] = 1;
int sum = 0, total = 0;
for (int x : nums) {
    sum += x;
    int r = ((sum % target) + target) % target;
    total += count[r];
    count[r]++;
}
return total;`,
        java: `Map<Integer,Integer> count = new HashMap<>();
count.put(0, 1);
int sum = 0, total = 0;
for (int x : nums) {
    sum += x;
    int r = ((sum % target) + target) % target;
    total += count.getOrDefault(r, 0);
    count.put(r, count.getOrDefault(r, 0) + 1);
}
return total;`,
    },
    "Contiguous Array": {
        cpp: `unordered_map<int,int> firstIdx;
firstIdx[0] = -1;
int sum = 0, best = 0;
for (int i = 0; i < (int)nums.size(); i++) {
    sum += (nums[i] == 0) ? -1 : 1;
    auto it = firstIdx.find(sum);
    if (it != firstIdx.end()) best = max(best, i - it->second);
    else firstIdx[sum] = i;
}
return best;`,
        java: `Map<Integer,Integer> firstIdx = new HashMap<>();
firstIdx.put(0, -1);
int sum = 0, best = 0;
for (int i = 0; i < nums.length; i++) {
    sum += (nums[i] == 0) ? -1 : 1;
    if (firstIdx.containsKey(sum)) best = Math.max(best, i - firstIdx.get(sum));
    else firstIdx.put(sum, i);
}
return best;`,
    },
    "Shortest Subarray With Sum at Least K": {
        cpp: `int n = (int)nums.size();
vector<long long> prefix(n + 1, 0);
for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
deque<int> dq;
int best = INT_MAX;
for (int i = 0; i <= n; i++) {
    while (!dq.empty() && prefix[i] - prefix[dq.front()] >= target) { best = min(best, i - dq.front()); dq.pop_front(); }
    while (!dq.empty() && prefix[dq.back()] >= prefix[i]) dq.pop_back();
    dq.push_back(i);
}
return best == INT_MAX ? -1 : best;`,
        java: `int n = nums.length;
long[] prefix = new long[n + 1];
for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
Deque<Integer> dq = new ArrayDeque<>();
int best = Integer.MAX_VALUE;
for (int i = 0; i <= n; i++) {
    while (!dq.isEmpty() && prefix[i] - prefix[dq.peekFirst()] >= target) { best = Math.min(best, i - dq.pollFirst()); }
    while (!dq.isEmpty() && prefix[dq.peekLast()] >= prefix[i]) dq.pollLast();
    dq.addLast(i);
}
return best == Integer.MAX_VALUE ? -1 : best;`,
    },
    "Count Range Sum": {
        cpp: `int n = (int)nums.size();
vector<long long> prefix(n + 1, 0);
for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
function<long long(int,int)> solve = [&](int lo, int hi) -> long long {
    if (hi - lo <= 1) return 0;
    int mid = (lo + hi) / 2;
    long long cnt = solve(lo, mid) + solve(mid, hi);
    int j = mid, k = mid;
    for (int i = lo; i < mid; i++) {
        while (j < hi && prefix[j] - prefix[i] < lower) j++;
        while (k < hi && prefix[k] - prefix[i] <= upper) k++;
        cnt += k - j;
    }
    vector<long long> merged;
    int l = lo, r = mid;
    while (l < mid && r < hi) merged.push_back(prefix[l] <= prefix[r] ? prefix[l++] : prefix[r++]);
    while (l < mid) merged.push_back(prefix[l++]);
    while (r < hi) merged.push_back(prefix[r++]);
    for (int i = 0; i < (int)merged.size(); i++) prefix[lo + i] = merged[i];
    return cnt;
};
return (int)solve(0, n + 1);`,
        java: `long[] prefix = new long[nums.length + 1];
for (int i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];
int lo2 = lower, hi2 = upper;
final long[] prefixRef = prefix;
java.util.function.BiFunction<Integer,Integer,Long>[] solveRef = new java.util.function.BiFunction[1];
solveRef[0] = (lo, hi) -> {
    if (hi - lo <= 1) return 0L;
    int mid = (lo + hi) / 2;
    long cnt = solveRef[0].apply(lo, mid) + solveRef[0].apply(mid, hi);
    int j = mid, k = mid;
    for (int i = lo; i < mid; i++) {
        while (j < hi && prefixRef[j] - prefixRef[i] < lo2) j++;
        while (k < hi && prefixRef[k] - prefixRef[i] <= hi2) k++;
        cnt += k - j;
    }
    long[] merged = new long[hi - lo];
    int l = lo, r = mid, idx = 0;
    while (l < mid && r < hi) merged[idx++] = prefixRef[l] <= prefixRef[r] ? prefixRef[l++] : prefixRef[r++];
    while (l < mid) merged[idx++] = prefixRef[l++];
    while (r < hi) merged[idx++] = prefixRef[r++];
    for (int i = 0; i < merged.length; i++) prefixRef[lo + i] = merged[i];
    return cnt;
};
return solveRef[0].apply(0, nums.length + 1).intValue();`,
    },
    "Merge Intervals": {
        cpp: `vector<vector<int>> arr = intervals;
sort(arr.begin(), arr.end(), [](const vector<int>& a, const vector<int>& b) { return a[0] < b[0]; });
vector<vector<int>> res;
for (auto& iv : arr) {
    int s = iv[0], e = iv[1];
    if (!res.empty() && s <= res.back()[1]) res.back()[1] = max(res.back()[1], e);
    else res.push_back({s, e});
}
return res;`,
        java: `int[][] arr = intervals.clone();
Arrays.sort(arr, (a, b) -> a[0] - b[0]);
List<int[]> res = new ArrayList<>();
for (int[] iv : arr) {
    int s = iv[0], e = iv[1];
    if (!res.isEmpty() && s <= res.get(res.size() - 1)[1]) {
        res.get(res.size() - 1)[1] = Math.max(res.get(res.size() - 1)[1], e);
    } else {
        res.add(new int[]{s, e});
    }
}
return res.toArray(new int[0][]);`,
    },
    "Insert Interval": {
        cpp: `vector<vector<int>> res;
int ns = newInterval[0], ne = newInterval[1];
int i = 0, n = (int)intervals.size();
while (i < n && intervals[i][1] < ns) res.push_back(intervals[i++]);
while (i < n && intervals[i][0] <= ne) { ns = min(ns, intervals[i][0]); ne = max(ne, intervals[i][1]); i++; }
res.push_back({ns, ne});
while (i < n) res.push_back(intervals[i++]);
return res;`,
        java: `List<int[]> res = new ArrayList<>();
int ns = newInterval[0], ne = newInterval[1];
int i = 0, n = intervals.length;
while (i < n && intervals[i][1] < ns) res.add(intervals[i++]);
while (i < n && intervals[i][0] <= ne) { ns = Math.min(ns, intervals[i][0]); ne = Math.max(ne, intervals[i][1]); i++; }
res.add(new int[]{ns, ne});
while (i < n) res.add(intervals[i++]);
return res.toArray(new int[0][]);`,
    },
    "Intervals Intersection": {
        cpp: `vector<vector<int>> res;
int i = 0, j = 0;
while (i < (int)a.size() && j < (int)b.size()) {
    int lo = max(a[i][0], b[j][0]);
    int hi = min(a[i][1], b[j][1]);
    if (lo <= hi) res.push_back({lo, hi});
    if (a[i][1] < b[j][1]) i++; else j++;
}
return res;`,
        java: `List<int[]> res = new ArrayList<>();
int i = 0, j = 0;
while (i < a.length && j < b.length) {
    int lo = Math.max(a[i][0], b[j][0]);
    int hi = Math.min(a[i][1], b[j][1]);
    if (lo <= hi) res.add(new int[]{lo, hi});
    if (a[i][1] < b[j][1]) i++; else j++;
}
return res.toArray(new int[0][]);`,
    },
    "Overlapping Intervals": {
        cpp: `vector<vector<int>> arr = intervals;
sort(arr.begin(), arr.end(), [](const vector<int>& x, const vector<int>& y) { return x[0] < y[0]; });
for (int i = 1; i < (int)arr.size(); i++) if (arr[i][0] < arr[i - 1][1]) return true;
return false;`,
        java: `int[][] arr = intervals.clone();
Arrays.sort(arr, (x, y) -> x[0] - y[0]);
for (int i = 1; i < arr.length; i++) if (arr[i][0] < arr[i - 1][1]) return true;
return false;`,
    },
    "Minimum Meeting Rooms": {
        cpp: `int n = (int)intervals.size();
vector<int> starts(n), ends(n);
for (int i = 0; i < n; i++) { starts[i] = intervals[i][0]; ends[i] = intervals[i][1]; }
sort(starts.begin(), starts.end());
sort(ends.begin(), ends.end());
int rooms = 0, best = 0, i = 0, j = 0;
while (i < n) {
    if (starts[i] < ends[j]) { rooms++; i++; best = max(best, rooms); }
    else { rooms--; j++; }
}
return best;`,
        java: `int n = intervals.length;
int[] starts = new int[n], ends = new int[n];
for (int i = 0; i < n; i++) { starts[i] = intervals[i][0]; ends[i] = intervals[i][1]; }
Arrays.sort(starts);
Arrays.sort(ends);
int rooms = 0, best = 0, i = 0, j = 0;
while (i < n) {
    if (starts[i] < ends[j]) { rooms++; i++; best = Math.max(best, rooms); }
    else { rooms--; j++; }
}
return best;`,
    },
    "Maximum CPU Load": {
        cpp: `vector<pair<int,int>> events;
for (auto& j : jobs) { events.push_back({j[0], j[2]}); events.push_back({j[1], -j[2]}); }
sort(events.begin(), events.end(), [](const pair<int,int>& a, const pair<int,int>& b) {
    if (a.first != b.first) return a.first < b.first;
    return a.second < b.second;
});
int cur = 0, best = 0;
for (auto& e : events) { cur += e.second; best = max(best, cur); }
return best;`,
        java: `int n = jobs.length;
int[][] events = new int[2 * n][2];
int idx = 0;
for (int[] j : jobs) { events[idx][0] = j[0]; events[idx][1] = j[2]; idx++; events[idx][0] = j[1]; events[idx][1] = -j[2]; idx++; }
Arrays.sort(events, (a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
int cur = 0, best = 0;
for (int[] e : events) { cur += e[1]; best = Math.max(best, cur); }
return best;`,
    },
};

module.exports = solutions;
