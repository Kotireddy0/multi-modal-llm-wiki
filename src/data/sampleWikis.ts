import { WikiKnowledgeBase } from '../types/wiki';

export const SAMPLE_WIKIS: WikiKnowledgeBase[] = [
  {
    id: 'sample-video-multimodal',
    title: 'Frontiers in Multimodal Reasoning: Video, Audio & Spatio-Temporal Latents',
    synopsis: 'A comprehensive technical symposium lecture delivering deep structural breakdowns of modern multimodal LLM architectures. Focuses on continuous spatio-temporal token compression, cross-attention bottlenecks, and real-time audio-visual grounding.',
    sourceType: 'video',
    sourceName: 'MIT_Symposium_Multimodal_Frontiers_2026.mp4',
    sourceMediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    sourceFileSize: '284 MB · 22:45 duration',
    createdAt: '2026-09-18T14:30:00Z',
    stats: {
      articleCount: 4,
      citationCount: 12,
      termsCount: 8,
      durationOrPages: '22m 45s runtime',
    },
    overviewTakeaways: [
      'Tokenizing 30fps continuous video directly into LLMs creates quadratic compute explosions; 3D temporal pooling compresses token load by 8.4x with zero perceptual degradation.',
      'Cross-attention projection layers suffer from semantic drift when aligning asynchronous audio phonemes with video keyframes.',
      'Direct autoregressive next-token prediction outperforms diffusion decoders for real-time robotic agency and multi-step physical causal reasoning.'
    ],
    articles: [
      {
        id: 'art-1',
        slug: 'temporal-compression-tokenization',
        title: '01. Spatio-Temporal Tokenization & Compression',
        subtitle: 'Resolving the quadratic context dilemma across high-framerate visual streams',
        category: 'Architecture & Tokenization',
        readingTimeMinutes: 5,
        summary: 'Examines why naively flattening video frames leads to context exhaustion, and details the 3D patch decomposition technique introduced at 03:15.',
        keyTakeaways: [
          'Standard ViT patchification yields over 14,000 tokens for a 10-second 1080p clip.',
          'Adaptive Spatio-Temporal Downsampling reduces token redundancy by 88% along stationary temporal vectors.',
          'Causal masking prevents future-frame leakage in real-time robotic teleoperation.'
        ],
        sections: [
          {
            id: 'sec-1-1',
            heading: 'The Quadratic Video Bottleneck',
            content: 'In standard vision transformers, feeding raw 4K or 1080p frames directly into an attention matrix generates an insurmountable token footprint. As highlighted in the opening keynote [cite:C1], a mere ten seconds of 30fps video produces over 14,000 spatial patches, quickly consuming attention cache margins and throttling inference throughput.',
            citationIds: ['C1']
          },
          {
            id: 'sec-1-2',
            heading: '3D Adaptive Temporal Pooling',
            content: 'To counter this, the architecture adopts a continuous 3D tubelet kernel [cite:C2]. Rather than extracting independent 2D frames, the encoder identifies high-variance motion trajectories across temporal slices, collapsing static background pixels into single persistent memory vectors while preserving dynamic foreground actors [cite:C3].',
            citationIds: ['C2', 'C3']
          }
        ]
      },
      {
        id: 'art-2',
        slug: 'audio-visual-cross-attention',
        title: '02. Cross-Modal Synchronization & Audio Alignment',
        subtitle: 'Unifying continuous acoustic waveforms with discrete visual embeddings',
        category: 'Multimodal Fusion',
        readingTimeMinutes: 4,
        summary: 'How acoustic phoneme streams and visual event anchors are fused without cross-attention saturation.',
        keyTakeaways: [
          'Audio sample rates (16kHz-44.1kHz) present mismatched temporal resolutions relative to video frame rates.',
          'Perceiver-style cross-attention latents act as synchronization bridges.',
          'Acoustic event boundaries can anchor visual keyframe sampling to save 40% compute.'
        ],
        sections: [
          {
            id: 'sec-2-1',
            heading: 'Asymmetric Temporal Alignment',
            content: 'Audio waveforms sample continuous pressure at 16,000 to 48,000 samples per second, while video frames are captured at discrete intervals (typically 24 to 60 fps). The presenter notes that attempting direct dot-product alignment between these modalities yields severe cross-modal interference [cite:C4].',
            citationIds: ['C4']
          },
          {
            id: 'sec-2-2',
            heading: 'Acoustic-Triggered Visual Focus',
            content: 'By using transient acoustic energy spikes (e.g. sharp impacts, sudden vocal transitions) as semantic triggers, the system selectively increases visual sampling frequency around critical narrative moments [cite:C5], achieving near-optimal grounding with 40% fewer total visual tokens.',
            citationIds: ['C5']
          }
        ]
      },
      {
        id: 'art-3',
        slug: 'physical-causality-reasoning',
        title: '03. Physical Causal Reasoning & World Modeling',
        subtitle: 'Evaluating predictive consistency in complex mechanical and dynamic scenarios',
        category: 'Empirical Evaluation',
        readingTimeMinutes: 6,
        summary: 'Empirical benchmarks demonstrating where multimodal models succeed at counterfactual physics vs where they hallucinate impossible collisions.',
        keyTakeaways: [
          'Models trained solely on static web images fail rigid-body momentum conservation tests 72% of the time.',
          'Pretraining with synthetic physics simulations reduces gravity and trajectory hallucination rates below 8%.',
          'Chain-of-thought visual trajectory plotting yields marked gains on robotic manipulation tests.'
        ],
        sections: [
          {
            id: 'sec-3-1',
            heading: 'Evaluating Rigid-Body Intuition',
            content: 'During the benchmark evaluation segment, the team presented results on the PhysBench collision suite [cite:C6]. Pure text-conditioned models routinely predicted that bouncing billiard balls would accelerate after collision or permeate solid barriers [cite:C7].',
            citationIds: ['C6', 'C7']
          },
          {
            id: 'sec-3-2',
            heading: 'Synthetic Simulation Fine-Tuning',
            content: 'Introducing structured synthetic simulation datasets with ground-truth velocity vectors resolved the majority of these errors [cite:C8]. The presenter emphasized that physical intuition is not an emergent byproduct of text alone, but requires temporal consistency loss constraints during pretraining.',
            citationIds: ['C8']
          }
        ]
      },
      {
        id: 'art-4',
        slug: 'real-time-deployment-tradeoffs',
        title: '04. Edge Deployment & Latency Optimization',
        subtitle: 'Quantization, KV caching, and sub-100ms streaming inference',
        category: 'Systems & Engineering',
        readingTimeMinutes: 4,
        summary: 'Hardware-level optimizations for serving multimodal video-reasoning models on resource-constrained robotics hardware.',
        keyTakeaways: [
          'FP8 weight quantization incurs less than 0.4% degradation in causal comprehension.',
          'Sliding-window video KV cache management caps RAM footprint to 6.2GB.',
          'Asynchronous token streaming achieves 42 tokens/sec on mobile embedded silicon.'
        ],
        sections: [
          {
            id: 'sec-4-1',
            heading: 'Sliding-Window Memory Management',
            content: 'Maintaining an unbounded KV cache for video streaming is physically impossible on embedded robotics hardware [cite:C9]. The speaker demonstrated a tiered eviction strategy that retains pivotal keyframe latents while evicting redundant intermediate motion vectors [cite:C10].',
            citationIds: ['C9', 'C10']
          }
        ]
      }
    ],
    citations: {
      'C1': {
        id: 'C1',
        sourceType: 'video',
        sourceTitle: 'MIT Multimodal Keynote',
        timestampStart: 75,
        timestampEnd: 110,
        timestampLabel: '01:15 - 01:50',
        sectionHeading: 'Opening Address: The Video Context Dilemma',
        quote: 'If you take ten seconds of standard 30fps video and naively run 16x16 patch extraction, you end up with over fourteen thousand individual tokens. That exhausts standard attention matrices before you even formulate the user prompt.',
        context: 'Explains the foundational mathematical reason why traditional 2D frame-by-frame LLM ingestion fails at scale.',
        confidence: 0.98
      },
      'C2': {
        id: 'C2',
        sourceType: 'video',
        sourceTitle: 'MIT Multimodal Keynote',
        timestampStart: 215,
        timestampEnd: 252,
        timestampLabel: '03:35 - 04:12',
        sectionHeading: 'Architecture: 3D Tubelet Convolution',
        quote: 'Instead of treating time as an isolated series of photos, we extend our convolution patch kernels into a third temporal dimension: creating tubelets across 4 consecutive frames.',
        context: 'Details the 3D patchification mechanism used to compress temporal redundancy.',
        confidence: 0.99
      },
      'C3': {
        id: 'C3',
        sourceType: 'video',
        sourceTitle: 'MIT Multimodal Keynote',
        timestampStart: 380,
        timestampEnd: 418,
        timestampLabel: '06:20 - 06:58',
        sectionHeading: 'Architecture: Static vs Dynamic Variance Filtering',
        quote: 'In typical robotics and security footage, up to 90% of the visual field is completely static background. By computing frame-to-frame pixel variance, we assign 95% of our tokens strictly to moving actors.',
        context: 'Explains how the model avoids wasting attention budget on stationary surroundings.',
        confidence: 0.96
      },
      'C4': {
        id: 'C4',
        sourceType: 'video',
        sourceTitle: 'MIT Multimodal Keynote',
        timestampStart: 530,
        timestampEnd: 574,
        timestampLabel: '08:50 - 09:34',
        sectionHeading: 'Modal Fusion: The Audio-Visual Mismatch',
        quote: 'Audio samples at 16,000 Hertz minimum, whereas video is 30 Hertz. Directly cross-attending these mismatched sample cadences creates severe high-frequency noise in the visual representations.',
        context: 'Describes the frequency and resolution disparity between auditory and visual representations.',
        confidence: 0.95
      },
      'C5': {
        id: 'C5',
        sourceType: 'video',
        sourceTitle: 'MIT Multimodal Keynote',
        timestampStart: 672,
        timestampEnd: 715,
        timestampLabel: '11:12 - 11:55',
        sectionHeading: 'Modal Fusion: Acoustic Keyframe Triggering',
        quote: 'When the acoustic encoder detects an abrupt energy spike—such as a door slamming or glass shattering—it sends an interrupt signal to the camera buffer to instantly double visual token density for 500 milliseconds.',
        context: 'Explains the bio-inspired audio interrupt mechanism that directs visual attention.',
        confidence: 0.97
      },
      'C6': {
        id: 'C6',
        sourceType: 'video',
        sourceTitle: 'MIT Multimodal Keynote',
        timestampStart: 810,
        timestampEnd: 855,
        timestampLabel: '13:30 - 14:15',
        sectionHeading: 'PhysBench: Testing Physical Grounding',
        quote: 'We subjected eight leading models to PhysBench, simulating 500 rigid body collisions with varying friction coefficients and restitution parameters.',
        context: 'Introduces the rigorous physics evaluation methodology.',
        confidence: 0.99
      },
      'C7': {
        id: 'C7',
        sourceType: 'video',
        sourceTitle: 'MIT Multimodal Keynote',
        timestampStart: 920,
        timestampEnd: 965,
        timestampLabel: '15:20 - 16:05',
        sectionHeading: 'PhysBench: Failure Modes of Static Models',
        quote: 'Without temporal grounding, models hallucinated objects gaining kinetic energy out of nowhere in 72% of trials, completely violating the conservation of momentum.',
        context: 'Concrete quantitative failure rate of static visual models when predicting physics.',
        confidence: 0.97
      },
      'C8': {
        id: 'C8',
        sourceType: 'video',
        sourceTitle: 'MIT Multimodal Keynote',
        timestampStart: 1060,
        timestampEnd: 1105,
        timestampLabel: '17:40 - 18:25',
        sectionHeading: 'PhysBench: Synthetic Physics Pretraining',
        quote: 'After fine-tuning on 100,000 synthetic MuJoCo physics trajectories with explicit velocity loss penalties, our violation rate plummeted from 72% down to 7.8%.',
        context: 'Key empirical triumph: synthetic grounding directly cures physical hallucination.',
        confidence: 0.98
      },
      'C9': {
        id: 'C9',
        sourceType: 'video',
        sourceTitle: 'MIT Multimodal Keynote',
        timestampStart: 1215,
        timestampEnd: 1260,
        timestampLabel: '20:15 - 21:00',
        sectionHeading: 'Hardware Deployment: The Robotics Memory Wall',
        quote: 'An autonomous drone or quad-legged robot has at best 16 gigabytes of shared unified memory. If your video KV cache grows linearly, the robot crashes into a tree within forty seconds.',
        context: 'Outlines the strict real-world hardware boundaries of embodied robotics.',
        confidence: 0.94
      },
      'C10': {
        id: 'C10',
        sourceType: 'video',
        sourceTitle: 'MIT Multimodal Keynote',
        timestampStart: 1300,
        timestampEnd: 1345,
        timestampLabel: '21:40 - 22:25',
        sectionHeading: 'Hardware Deployment: Keyframe Retention Algorithms',
        quote: 'By ranking KV cache pages based on attention centrality scores, we evict 85% of redundant intermediate frames while retaining anchors, bounding total cache memory strictly to 6.2 gigabytes indefinitely.',
        context: 'Details the mathematical solution to continuous streaming inference.',
        confidence: 0.97
      }
    },
    glossary: [
      {
        term: '3D Tubelet Kernel',
        definition: 'A spatiotemporal convolution kernel that groups pixels across both 2D spatial dimensions (X, Y) and time (T) into a single unified continuous representation.',
        citationId: 'C2'
      },
      {
        term: 'PhysBench',
        definition: 'An empirical benchmark suite designed to evaluate LLMs on rigid body mechanics, gravity, friction, and kinematic momentum conservation.',
        citationId: 'C6'
      },
      {
        term: 'Acoustic-Triggered Sampling',
        definition: 'A multimodal mechanism where audio energy spikes interrupt background visual processing to dynamically allocate higher frame-rate tokens around auditory events.',
        citationId: 'C5'
      },
      {
        term: 'Centrality-Based KV Eviction',
        definition: 'An attention caching algorithm that ranks key-value cache tokens by cumulative attention weight and selectively purges redundant transitional frames.',
        citationId: 'C10'
      }
    ],
    timeline: [
      {
        id: 't1',
        timestamp: '01:15',
        seconds: 75,
        title: 'The Video Context Bottleneck',
        description: 'Demonstration of quadratic attention explosion across 30fps inputs.',
        citationId: 'C1'
      },
      {
        id: 't2',
        timestamp: '03:35',
        seconds: 215,
        title: '3D Tubelet Convolution Introduced',
        description: 'Mathematical derivation of spatiotemporal tokenization.',
        citationId: 'C2'
      },
      {
        id: 't3',
        timestamp: '08:50',
        seconds: 530,
        title: 'Audio-Visual Synchronization Bottleneck',
        description: 'Comparing 16kHz audio sampling against 30fps discrete frames.',
        citationId: 'C4'
      },
      {
        id: 't4',
        timestamp: '13:30',
        seconds: 810,
        title: 'PhysBench Experimental Findings',
        description: '72% failure rate in standard models and subsequent synthetic fix.',
        citationId: 'C6'
      },
      {
        id: 't5',
        timestamp: '20:15',
        seconds: 1215,
        title: 'Edge Robotics Deployment & KV Cache Cap',
        description: 'Limiting video inference to 6.2GB RAM on embedded edge devices.',
        citationId: 'C9'
      }
    ],
    entityGraph: [
      {
        id: 'e1',
        name: '3D Tubelet Compression',
        type: 'technology',
        description: 'Spatiotemporal patch extraction algorithm.',
        connections: ['PhysBench', 'Robotics Edge Deployment', 'Acoustic Sampling']
      },
      {
        id: 'e2',
        name: 'PhysBench',
        type: 'metric',
        description: 'Rigid body physics and momentum evaluation benchmark.',
        connections: ['3D Tubelet Compression', 'Synthetic Physics Fine-Tuning']
      },
      {
        id: 'e3',
        name: 'Synthetic Physics Fine-Tuning',
        type: 'concept',
        description: 'MuJoCo trajectory training to eliminate momentum violations.',
        connections: ['PhysBench']
      },
      {
        id: 'e4',
        name: 'Robotics Edge Deployment',
        type: 'concept',
        description: 'Sub-100ms inference on 16GB memory robotics platforms.',
        connections: ['Centrality KV Eviction', '3D Tubelet Compression']
      },
      {
        id: 'e5',
        name: 'Centrality KV Eviction',
        type: 'technology',
        description: 'Centrality-weighted memory eviction keeping cache under 6.2GB.',
        connections: ['Robotics Edge Deployment']
      }
    ],
    suggestedQuestions: [
      'Why does standard 2D patch extraction fail when processing 10 seconds of video?',
      'How does the acoustic interrupt mechanism reduce total visual token consumption by 40%?',
      'What were the specific failure rates observed on PhysBench before and after synthetic fine-tuning?',
      'How does the system ensure the KV cache does not overflow the 16GB RAM limit on autonomous robots?'
    ]
  },
  {
    id: 'sample-pdf-sparse-moe',
    title: 'Sparse Mixture-of-Experts: Scaling Laws, Routing Stability & Memory Frontiers',
    synopsis: 'An authoritative scientific research monograph analyzing sparse Mixture-of-Experts (MoE) transformer architectures at the 120B+ parameter scale. Covers auxiliary loss balancing, expert capacity factors, and multi-node all-to-all communication overhead.',
    sourceType: 'pdf',
    sourceName: 'Arxiv_2604_Sparse_MoE_Scaling_Dynamics.pdf',
    sourceFileSize: '18.4 MB · 34 Pages',
    createdAt: '2026-08-12T09:15:00Z',
    stats: {
      articleCount: 4,
      citationCount: 10,
      termsCount: 6,
      durationOrPages: '34 Pages',
    },
    overviewTakeaways: [
      'Top-2 routing with load-balancing loss prevents 99% of expert collapse scenarios while sustaining dense-model performance at 31% the FLOP cost.',
      'All-to-all communication collectives across GPU interconnects constitute 48% of total inference latency when experts are partitioned across multi-node clusters.',
      'Fine-grained expert granularity (e.g. 64 small experts vs 8 large experts) dramatically improves factual recall in specialized technical domains.'
    ],
    articles: [
      {
        id: 'art-moe-1',
        slug: 'routing-dynamics-stability',
        title: '01. Routing Mechanics & Auxiliary Load Balancing',
        subtitle: 'Preventing winner-takes-all token routing pathologies in sparse layers',
        category: 'Core Theory',
        readingTimeMinutes: 5,
        summary: 'Mathematical formulation of softmax routing, gating networks, and the auxiliary loss penalty that ensures uniform expert utilization.',
        keyTakeaways: [
          'Unconstrained routing naturally concentrates 80% of tokens into 2 popular experts.',
          'Auxiliary load-balancing loss with coefficient alpha=0.01 restores uniform distribution.',
          'Expert capacity factor epsilon=1.25 provides the optimal trade-off between token dropping and compute waste.'
        ],
        sections: [
          {
            id: 'sec-moe-1-1',
            heading: 'The Routing Pathology Problem',
            content: 'Without explicit dispersion constraints, gating networks inevitably gravitate toward a degenerate winner-takes-all state [cite:C101]. As established in Section 2.1, early gradient updates cause certain experts to acquire slight advantages, causing subsequent tokens to overwhelm those few parameters while remaining experts starve [cite:C102].',
            citationIds: ['C101', 'C102']
          },
          {
            id: 'sec-moe-1-2',
            heading: 'Formulation of the Auxiliary Penalty',
            content: 'The authors formulate an auxiliary balancing loss based on the inner product of the gating probability distribution and the fraction of tokens routed [cite:C103]. When minimized, this loss guarantees that expert dispatch deviates by less than 3% from uniform across 100M-token training steps.',
            citationIds: ['C103']
          }
        ]
      },
      {
        id: 'art-moe-2',
        slug: 'communication-all-to-all',
        title: '02. Distributed Interconnects & All-to-All Bottlenecks',
        subtitle: 'Analyzing network bandwidth limits across multi-node GPU clusters',
        category: 'Systems & Interconnect',
        readingTimeMinutes: 5,
        summary: 'Examines why cross-node InfiniBand and NVLink transfers become the primary latency bottleneck in distributed MoE serving.',
        keyTakeaways: [
          'All-to-all collective communication accounts for 48% of token latency on 8-node clusters.',
          'Hierarchical routing restricts 75% of token dispatching within local NVLink intra-node domains.',
          'Overlapping communication and compute kernels via double-buffering reclaims 22% wall-clock speed.'
        ],
        sections: [
          {
            id: 'sec-moe-2-1',
            heading: 'The All-to-All Network Wall',
            content: 'In standard dense models, communication is confined to all-reduce operations during gradient updates or tensor parallelism. In contrast, sparse MoE models require every GPU to dispatch tokens to distant GPUs hosting the target expert [cite:C104]. Under standard cross-node PCIe/Ethernet bridges, network serialization dominates the forward pass [cite:C105].',
            citationIds: ['C104', 'C105']
          }
        ]
      },
      {
        id: 'art-moe-3',
        slug: 'expert-granularity-specialization',
        title: '03. Expert Granularity & Domain Specialization',
        subtitle: 'Comparing 8 large experts against 64 fine-grained modular sub-networks',
        category: 'Architecture Scaling',
        readingTimeMinutes: 4,
        summary: 'Empirical data proving that finer expert division increases modularity and specialized domain retrieval.',
        keyTakeaways: [
          'Splitting a single 16B parameter expert into 8x 2B parameter micro-experts improves MMLU STEM scores by 4.2 points.',
          'Fine-grained routing enables dynamic expert offloading to flash memory without thrashing.'
        ],
        sections: [
          {
            id: 'sec-moe-3-1',
            heading: 'Empirical Granularity Sweep',
            content: 'On page 18, Table 4 documents a systematic comparison between architectures of identical parameter count [cite:C106]. The 64-expert variant consistently outperformed the 8-expert model across organic chemistry, legal analysis, and assembly code generation benchmarks [cite:C107].',
            citationIds: ['C106', 'C107']
          }
        ]
      }
    ],
    citations: {
      'C101': {
        id: 'C101',
        sourceType: 'pdf',
        sourceTitle: 'Sparse MoE Scaling Dynamics',
        pageNumber: 3,
        sectionHeading: 'Section 2.1: Router Degeneracy and Starvation',
        quote: 'In unregularized top-k gating, over 82% of all tokens in the C4 validation corpus were routed to only 2 of the 16 available experts, causing catastrophic capacity overflow and dropping 41% of tokens.',
        context: 'Empirical measurement of expert collapse without auxiliary regularization.',
        confidence: 0.99
      },
      'C102': {
        id: 'C102',
        sourceType: 'pdf',
        sourceTitle: 'Sparse MoE Scaling Dynamics',
        pageNumber: 5,
        sectionHeading: 'Section 2.3: Capacity Factor and Overflow Handling',
        quote: 'We define the expert capacity C as the maximum number of tokens an expert can accept per batch: C = ceil( (k * N / E) * (1 + epsilon) ). Setting epsilon = 0.25 minimizes token dropping to less than 0.05% without wasting memory.',
        context: 'Mathematical equation for expert buffer capacity.',
        confidence: 0.98
      },
      'C103': {
        id: 'C103',
        sourceType: 'pdf',
        sourceTitle: 'Sparse MoE Scaling Dynamics',
        pageNumber: 7,
        sectionHeading: 'Section 3.1: The Auxiliary Loss Formula',
        quote: 'L_aux = alpha * E * sum_{i=1}^E ( m_i * P_i ), where m_i is the fraction of tokens dispatched to expert i, and P_i is the mean routing probability assigned by the softmax router.',
        context: 'Defines the exact loss equation enforcing balanced load.',
        confidence: 0.99
      },
      'C104': {
        id: 'C104',
        sourceType: 'pdf',
        sourceTitle: 'Sparse MoE Scaling Dynamics',
        pageNumber: 12,
        sectionHeading: 'Section 4.2: Profiling All-to-All Interconnects',
        quote: 'Across an 8-node cluster connected via 400 Gbps InfiniBand, all-to-all communication collective exchanges consume 48.3% of the total forward pass wall-clock time at sequence length 4,096.',
        context: 'Identifies the primary hardware scaling bottleneck.',
        confidence: 0.96
      },
      'C105': {
        id: 'C105',
        sourceType: 'pdf',
        sourceTitle: 'Sparse MoE Scaling Dynamics',
        pageNumber: 15,
        sectionHeading: 'Section 4.4: Hierarchical Locality-Aware Routing',
        quote: 'By biasing the routing score toward co-located intra-node GPUs, we retain 74.8% of token transfers within NVLink domain boundaries, slashing cross-node network serialization by 3.1x.',
        context: 'Introduces hierarchical routing to overcome network bottlenecks.',
        confidence: 0.97
      },
      'C106': {
        id: 'C106',
        sourceType: 'pdf',
        sourceTitle: 'Sparse MoE Scaling Dynamics',
        pageNumber: 18,
        sectionHeading: 'Table 4: Granularity Comparison (8 vs 64 Experts)',
        quote: 'Under equal active FLOPs (14.2B active parameters), the 64-expert configuration achieved 81.4% on MMLU versus 77.2% for the 8-expert configuration.',
        context: 'Direct quantitative proof that finer granularity yields superior accuracy.',
        confidence: 0.98
      },
      'C107': {
        id: 'C107',
        sourceType: 'pdf',
        sourceTitle: 'Sparse MoE Scaling Dynamics',
        pageNumber: 21,
        sectionHeading: 'Section 5.2: Domain Modularity in Chemistry & Code',
        quote: 'Inspecting activation heatmaps reveals that Expert #47 and Expert #52 specifically specialized in cyclic aromatic hydrocarbons and x86 register allocation respectively.',
        context: 'Proof of organic modular specialization in fine-grained experts.',
        confidence: 0.95
      }
    },
    glossary: [
      {
        term: 'Expert Capacity Factor (epsilon)',
        definition: 'A multiplier applied to average token load determining the buffer threshold before an expert drops excess tokens.',
        citationId: 'C102'
      },
      {
        term: 'All-to-All Collective',
        definition: 'A distributed communication primitive where each processor transmits distinct data chunks to all other participating nodes simultaneously.',
        citationId: 'C104'
      },
      {
        term: 'Hierarchical Routing',
        definition: 'A routing strategy that prioritizes routing tokens to experts situated on the same local motherboard or NVLink mesh before routing cross-node.',
        citationId: 'C105'
      }
    ],
    timeline: [
      {
        id: 'tp1',
        title: 'Section 1: Introduction to Sparse Scaling',
        description: 'Motivation for MoE architectures and historical context.',
        timestamp: 'Page 1 - 3'
      },
      {
        id: 'tp2',
        title: 'Section 2: Mathematical Formulation of Top-k Routing',
        description: 'Capacity limits and loss derivations.',
        timestamp: 'Page 4 - 8',
        citationId: 'C102'
      },
      {
        id: 'tp3',
        title: 'Section 4: Interconnect Profiling & All-to-All Bottleneck',
        description: 'Network saturation on 400 Gbps InfiniBand.',
        timestamp: 'Page 12 - 16',
        citationId: 'C104'
      },
      {
        id: 'tp4',
        title: 'Section 5: Empirical Benchmarks on MMLU',
        description: 'Table 4 comparison of 8 vs 64 expert granularity.',
        timestamp: 'Page 18 - 22',
        citationId: 'C106'
      }
    ],
    entityGraph: [
      {
        id: 'em1',
        name: 'Sparse MoE Routing',
        type: 'concept',
        description: 'Selective computation forwarding tokens to subset of experts.',
        connections: ['Auxiliary Loss Regularization', 'All-to-All Communication', 'Expert Granularity']
      },
      {
        id: 'em2',
        name: 'Auxiliary Loss Regularization',
        type: 'technology',
        description: 'Prevents router collapse to preserve balanced expert utilization.',
        connections: ['Sparse MoE Routing']
      },
      {
        id: 'em3',
        name: 'All-to-All Communication',
        type: 'metric',
        description: 'Network collective bottleneck consuming 48% latency.',
        connections: ['Hierarchical Locality Routing', 'Sparse MoE Routing']
      },
      {
        id: 'em4',
        name: 'Hierarchical Locality Routing',
        type: 'technology',
        description: 'Confines 75% transfers to NVLink to bypass cross-node bottlenecks.',
        connections: ['All-to-All Communication']
      }
    ],
    suggestedQuestions: [
      'What happens when an MoE model is trained without the auxiliary load-balancing loss?',
      'Why does all-to-all communication consume nearly half of forward-pass latency?',
      'What are the concrete performance differences between 8 large experts and 64 fine-grained experts on MMLU?',
      'How does the capacity factor epsilon prevent token dropping without overflowing GPU VRAM?'
    ]
  }
];
