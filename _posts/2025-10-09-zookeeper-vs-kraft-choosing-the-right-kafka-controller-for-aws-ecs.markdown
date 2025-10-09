---
layout: post
title: "ZooKeeper vs KRaft — Choosing the Right Kafka Controller on AWS ECS"
date: 2025-10-09 11:40:00 +0700
categories: kafka aws ecs architecture
---

When deploying a stable Kafka cluster on AWS ECS, one of the most important architectural choices you'll make is the metadata controller — whether to use the legacy ZooKeeper or the new KRaft (Kafka Raft) mode introduced in Apache Kafka 3.x+.

This post compares both approaches, explores production adoption, and provides actionable recommendations for deploying Kafka on ECS.

## Quick Summary

- KRaft (Kafka Raft / KIP-500) is the new built-in metadata and controller system that removes the ZooKeeper dependency.
- ZooKeeper remains mature and proven, but is deprecated in newer Kafka releases.
- For new clusters, KRaft is now the recommended and default option in Apache Kafka 4.x and managed platforms like AWS MSK and Confluent Cloud.

## Architecture Overview

| Feature | ZooKeeper | KRaft |
|----------|------------|--------|
| **Architecture** | Separate ZooKeeper cluster manages metadata, leader election, ACLs | Integrated Raft-based metadata quorum built into Kafka |
| **Components** | Kafka + ZooKeeper (two distributed systems) | Only Kafka processes (simpler) |
| **Controller Election** | Managed by ZooKeeper | Managed internally by Raft quorum |
| **Operational Complexity** | High – maintain ZooKeeper ensemble | Lower – single system |
| **Scalability** | Good but limited at very large partition counts | Better scaling for metadata |
| **Maturity** | Battle-tested for years | Production-ready since Kafka 3.3 |
| **Future Support** | Deprecated and removed in Kafka 5.0+ | Long-term supported path |

## Pros and Cons

### ZooKeeper
**Pros**
- Extremely mature and well-understood.
- Supported by most older tools and operators.
- Stable in large-scale legacy environments.

**Cons**
- Extra cluster to operate (ZK ensemble).
- Metadata scaling limits.
- Deprecated in new Kafka versions.

### KRaft
**Pros**
- No external ZooKeeper dependency.
- Simpler architecture and operations.
- Better metadata performance and scalability.
- Recommended for all new deployments.

**Cons**
- Migration from ZooKeeper clusters can be complex.
- Some ecosystem tooling (older connectors/operators) may need updates.

## Real-world Adoption

- Confluent Platform: KRaft is now the default metadata mode.
- Amazon MSK: Supports KRaft for new clusters since 2024.
- Self-managed users: Growing adoption; greenfield clusters are mostly KRaft-based.
- Legacy clusters (e.g., older LinkedIn, Uber setups) still use ZooKeeper, but migrations are in progress across the ecosystem.

> Public confirmations from major enterprises about full KRaft migration are rare, but vendor-level support indicates strong production readiness.

## Deploying Kafka on AWS ECS (Self-managed)

### 1. Choose KRaft for New Clusters
- Use KRaft mode to avoid the legacy ZooKeeper dependency.
- Plan for 3 or 5 dedicated controller nodes for quorum stability.

### 2. Topology Best Practices
- Deploy controllers and brokers in different ECS services.
- Spread tasks across multiple AZs for HA.
- Use EBS volumes (gp3/io1) for broker storage; avoid EFS.

### 3. Containerization Guidelines
- Assign fixed broker IDs using ECS task metadata or env vars.
- Persist `/var/lib/kafka/data` via attached volumes.
- Use capacity providers for host stability.

### 4. Monitoring & Ops
- Integrate Prometheus + Grafana dashboards.
- Monitor:
  - Controller leader changes
  - Under-replicated partitions
  - Disk utilization
  - JVM/GC pauses
- Alert on controller quorum health.

### 5. Backup & Upgrade
- Snapshot configs and metadata.
- Test rolling upgrades in staging.
- Validate migration tooling before moving ZooKeeper → KRaft.

## When to Use Managed Services

If managing ECS tasks and storage sounds heavy, consider:
- Amazon MSK (KRaft mode) — AWS-managed brokers, controller quorum, and monitoring.
- Confluent Cloud — Fully managed Kafka, abstracting all infrastructure.

Both are production-ready with KRaft, removing most operational burden.

## Recommended Decision Flow

1. New deployment on ECS → Use KRaft.
2. Existing ZooKeeper clusters → Plan migration with tooling support (Kafka ≥3.3).
3. Low-ops requirement → Choose MSK or Confluent Cloud.
4. Self-managed ECS → Isolate controllers, persist volumes, monitor actively.

## References & Further Reading

- [Confluent: KRaft Overview and Migration Guide](https://docs.confluent.io/platform/current/kraft.html)
- [AWS MSK: KRaft Support Announcement](https://aws.amazon.com/about-aws/whats-new/2024/aws-msk-adds-kraft-mode/)
- [Strimzi Blog: KRaft Mode and Migration Considerations](https://strimzi.io/blog/tag/kraft/)
- [Kai Waehner: Kafka 3.x Architecture Evolution](https://www.kai-waehner.de/blog)
- [Apache Kafka KIP-500 Proposal](https://cwiki.apache.org/confluence/display/KAFKA/KIP-500%3A+Replace+ZooKeeper+with+a+Self-Managed+Metadata+Quorum)