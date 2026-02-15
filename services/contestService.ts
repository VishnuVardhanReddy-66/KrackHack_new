
import { Contest } from '../types';

/**
 * Generates dynamic mock data when the external API is unreachable.
 * Populated with a rich set of contests across the entire year 2026.
 */
const getFallbackContests = (): any[] => {
  const now = new Date();
  const year = 2026;
  
  // Specifically set a Codeforces contest for 8:35 PM (20:35) on the current date
  const codeforcesToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 35, 0);

  const createDate = (m: number, d: number, h: number) => {
    return new Date(year, m - 1, d, h).toISOString();
  };

  const contests = [
    // Today's Spotlight Contest
    {
      name: "Codeforces Round #1001 (Div. 1 + Div. 2)",
      url: "https://codeforces.com/contests",
      start_time: codeforcesToday.toISOString(),
      end_time: new Date(codeforcesToday.getTime() + 1000 * 60 * 60 * 2).toISOString(),
      duration: "7200",
      site: "Codeforces",
      status: "BEFORE"
    },
    // January
    { name: "CodeChef Starters 170", url: "https://codechef.com", start_time: createDate(1, 10, 20), end_time: createDate(1, 10, 23), duration: "10800", site: "CodeChef" },
    { name: "Codeforces Round #1005", url: "https://codeforces.com", start_time: createDate(1, 24, 19), end_time: createDate(1, 24, 21), duration: "7200", site: "Codeforces" },
    // February
    { name: "AtCoder Beginner Contest 360", url: "https://atcoder.jp", start_time: createDate(2, 7, 17), end_time: createDate(2, 7, 19), duration: "7200", site: "AtCoder" },
    { name: "LeetCode Weekly Contest 410", url: "https://leetcode.com", start_time: createDate(2, 22, 8), end_time: createDate(2, 22, 10), duration: "7200", site: "LeetCode" },
    // March
    { name: "Codeforces Round #1010", url: "https://codeforces.com", start_time: createDate(3, 10, 19), end_time: createDate(3, 10, 21), duration: "7200", site: "Codeforces" },
    { name: "CodeChef Starters 180", url: "https://codechef.com", start_time: createDate(3, 18, 20), end_time: createDate(3, 18, 23), duration: "10800", site: "CodeChef" },
    { name: "AtCoder Regular Contest 185", url: "https://atcoder.jp", start_time: createDate(3, 29, 17), end_time: createDate(3, 29, 19), duration: "7200", site: "AtCoder" },
    // April
    { name: "LeetCode Biweekly Contest 135", url: "https://leetcode.com", start_time: createDate(4, 11, 20), end_time: createDate(4, 11, 22), duration: "7200", site: "LeetCode" },
    { name: "Codeforces Round #1020", url: "https://codeforces.com", start_time: createDate(4, 25, 19), end_time: createDate(4, 25, 21), duration: "7200", site: "Codeforces" },
    // May
    { name: "CodeChef Starters 190", url: "https://codechef.com", start_time: createDate(5, 13, 20), end_time: createDate(5, 13, 23), duration: "10800", site: "CodeChef" },
    { name: "AtCoder Beginner Contest 370", url: "https://atcoder.jp", start_time: createDate(5, 24, 17), end_time: createDate(5, 24, 19), duration: "7200", site: "AtCoder" },
    // June
    { name: "Google Kickstart Round B", url: "https://codingcompetitions.withgoogle.com", start_time: createDate(6, 7, 14), end_time: createDate(6, 7, 17), duration: "10800", site: "Google" },
    { name: "Codeforces Round #1035", url: "https://codeforces.com", start_time: createDate(6, 21, 19), end_time: createDate(6, 21, 21), duration: "7200", site: "Codeforces" },
    // July
    { name: "CodeChef Starters 200", url: "https://codechef.com", start_time: createDate(7, 15, 20), end_time: createDate(7, 15, 23), duration: "10800", site: "CodeChef" },
    { name: "AtCoder Regular Contest 190", url: "https://atcoder.jp", start_time: createDate(7, 26, 17), end_time: createDate(7, 26, 19), duration: "7200", site: "AtCoder" },
    // August
    { name: "LeetCode Weekly Contest 440", url: "https://leetcode.com", start_time: createDate(8, 9, 8), end_time: createDate(8, 9, 10), duration: "7200", site: "LeetCode" },
    { name: "Codeforces Global Round 30", url: "https://codeforces.com", start_time: createDate(8, 23, 19), end_time: createDate(8, 23, 22), duration: "10800", site: "Codeforces" },
    // September
    { name: "Google Farewell Round Final", url: "https://codingcompetitions.withgoogle.com", start_time: createDate(9, 6, 10), end_time: createDate(9, 6, 14), duration: "14400", site: "Google" },
    { name: "CodeChef Starters 210", url: "https://codechef.com", start_time: createDate(9, 20, 20), end_time: createDate(9, 20, 23), duration: "10800", site: "CodeChef" },
    // October
    { name: "AtCoder Beginner Contest 380", url: "https://atcoder.jp", start_time: createDate(10, 4, 17), end_time: createDate(10, 4, 19), duration: "7200", site: "AtCoder" },
    { name: "Codeforces Round #1050", url: "https://codeforces.com", start_time: createDate(10, 18, 19), end_time: createDate(10, 18, 21), duration: "7200", site: "Codeforces" },
    // November
    { name: "LeetCode Biweekly Contest 145", url: "https://leetcode.com", start_time: createDate(11, 7, 20), end_time: createDate(11, 7, 22), duration: "7200", site: "LeetCode" },
    { name: "Meta Hacker Cup Round 1", url: "https://meta.com", start_time: createDate(11, 22, 10), end_time: createDate(11, 23, 10), duration: "86400", site: "Meta" },
    // December
    { name: "CodeChef Starters 230", url: "https://codechef.com", start_time: createDate(12, 6, 20), end_time: createDate(12, 6, 23), duration: "10800", site: "CodeChef" },
    { name: "Google Code Jam Finals", url: "https://google.com", start_time: createDate(12, 20, 10), end_time: createDate(12, 20, 14), duration: "14400", site: "Google" },
  ];

  return contests;
};

export const contestService = {
  /**
   * Fetches all contests from the Kontests API using a reliable CORS proxy and timeout.
   */
  async fetchContests(): Promise<{ data: Contest[], isFallback: boolean }> {
    let rawData: any[] = [];
    let isFallback = false;
    
    // Create an AbortController to handle request timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); 

    try {
      const targetUrl = 'https://kontests.net/api/v1/all';
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      rawData = await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      rawData = getFallbackContests();
      isFallback = true;
    }
    
    const now = new Date();

    const processed = rawData.map((item: any, index: number) => {
      const start = new Date(item.start_time);
      const end = new Date(item.end_time);

      let status: 'UPCOMING' | 'LIVE' | 'FINISHED' = 'UPCOMING';
      if (now >= start && now <= end) {
        status = 'LIVE';
      } else if (now > end) {
        status = 'FINISHED';
      }

      const durationSec = parseInt(item.duration) || 0;
      const hours = Math.floor(durationSec / 3600);
      const minutes = Math.floor((durationSec % 3600) / 60);
      const durationStr = hours > 0 ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}` : `${minutes}m`;

      const formattedDate = start.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short'
      });

      return {
        id: `${item.site}-${index}-${start.getTime()}`,
        platform: item.site,
        title: item.name,
        startTime: formattedDate,
        rawStartTime: item.start_time,
        endTime: item.end_time,
        duration: durationStr,
        link: item.url,
        status: status
      };
    })
    .sort((a, b) => new Date(a.rawStartTime).getTime() - new Date(b.rawStartTime).getTime());

    return { data: processed, isFallback };
  }
};
